pragma solidity ^0.6.0;

import "./SafeMath.sol";
import "./ERC20.sol";
import "./GambitToken.sol";

/// @title Gambit Private Owner Bet - Creates security protocals for the gambit private owner bet contract.
/// @created Denis Angell - October, 12 2020
/// @updated Denis Angell - June, 10 2023

contract GambitPrivateOwnerBet {

    using SafeMath for uint256;

    /*
    * Token
    */

    GambitToken public token;

    /*
    *  Bet Events
    */
    event BetDeposit(address indexed sender, uint value);
    event BetSubmission(uint indexed slipId);
    event BetSealed(uint indexed slipId);
    event BetExecution(uint indexed slipId, address indexed reciepient, uint value);
    event BetRelease(address indexed reciepient, uint value);
    event BetRefund(uint indexed slipId, address indexed reciepient, uint value);
    event BetStateChange(address changedBy, State newState);

    /*
    * Settlement Events
    */

    event SettlementSubmission(uint indexed settlementId);
    event SettlementConfirmation(address indexed sender, uint indexed settlementId);
    event SettlementRevocation(address indexed sender, uint indexed settlementId);
    event SettlementExecution(uint indexed settlementId);
    event SettlementExecutionFailure(uint indexed settlementId);
    event SettlementOwnerAddition(address indexed owner);
    event SettlementOwnerRemoval(address indexed owner);

    /*
    *  Bet Constants
    */
    bool public isFrozen = false;
    uint public gambitFee = 3;

    /*
    *  Settlement Constants
    */
    uint public MAX_OWNER_COUNT = 50;

    /*
    * Bet State
    */

    enum State {
        Deployed,
        Ended,
        Settled,
        Released,
        Refunded
    }

    State public betState;

    /*
    *  Bet Structures
    */
    struct Slip {
        address payable destination;
        uint256 value;
        uint256 win;
        uint256 position;
        uint256 toSeal;
        bool executed;
        bool refunded;
    }

    /*
    * Bet Storage
    *
    */
    mapping (uint => Slip) public slips;
    address payable beneficiaryAddress = address(0);
    uint256 public odd = 0;
    string public outcome = "";
    uint256 public winningPosition;
    uint public slipCount;

    /*
    *  Settlement Storage
    */
    mapping (uint => Settlement) public settlements;
    mapping (uint => mapping (address => bool)) public confirmations;
    mapping (address => bool) public isOwner;
    address[] public owners;
    uint public settlementCount;
    uint public ownerCount;
    address public masterOwner;


    /*
    *  Settlement Structures
    */
    struct Settlement {
        address owner;
        uint position;
        bytes data;
        bool executed;
    }

    /*
    *  Bet Modifiers
    */

    modifier activeBet() {
        require(!isFrozen);
        _;
    }

    modifier frozenBet() {
        require(isFrozen);
        _;
    }

    modifier validAddress() {
        require(address(0) != msg.sender);
        _;
    }

    modifier onlyBeneficiary() {
        require(msg.sender == beneficiaryAddress);
        _;
    }

    modifier isEnded() {
        require(betState == State.Ended);
        _;
    }

    modifier isSettled() {
        require(betState == State.Settled);
        _;
    }

    modifier slipExists(uint slipId) {
        require(slips[slipId].destination != address(0));
        _;
    }

    modifier notExecutedSlip(uint slipId) {
        require(!slips[slipId].executed);
        _;
    }

    /*
    *  Settlement Modifiers
    */

    modifier onlyOwner() {
        require(msg.sender == masterOwner);
        _;
    }

    modifier ownerDoesNotExist(address owner) {
        require(!isOwner[owner]);
        _;
    }

    modifier ownerExists(address owner) {
        require(isOwner[owner]);
        _;
    }

    modifier settlementExists(uint settlementId) {
        require(settlements[settlementId].owner == msg.sender);
        _;
    }

    modifier confirmed(uint settlementId, address owner) {
        require(confirmations[settlementId][owner]);
        _;
    }

    modifier notConfirmed(uint settlementId, address owner) {
        require(!confirmations[settlementId][owner]);
        _;
    }

    modifier notExecutedSettlement(uint settlementId) {
        require(!settlements[settlementId].executed);
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0));
        _;
    }

    modifier validRequirement(uint _ownerCount, uint _required) {
        require(_ownerCount <= MAX_OWNER_COUNT && _required <= ownerCount && _required != 0 && ownerCount != 0);
        _;
    }

    /**
     * @return the beneficiaryAddress of the contract.
     */
    function bene() public view returns (address) {
        return beneficiaryAddress;
    }

    /**
     * Freeze and UnFreeze Wallet
     */
    function freeze() public onlyOwner activeBet {
        isFrozen = true;
    }
    function unFreeze() public onlyOwner frozenBet {
        isFrozen = false;
    }

    /*
    * Public functions
    */
    /// @dev Contract constructor sets initial owners.
    /// @param _owners Owners List.
    /// @param _beneficiaryAddress Beneficiary Address.
    /// @param _odd Odds (as Int).
    /// @param _outcome Outcome (as String).
    /// @param _position Deployer Bet Position (as Int).
    constructor(address[] memory _owners, address payable _beneficiaryAddress, uint256 _odd, string memory _outcome, uint256 _position, uint256 _amount, GambitToken _token)
        public
        validAddress()
    {
        for (uint i = 0; i < _owners.length; i++) {
            require(!isOwner[_owners[i]] && _owners[i] != address(0));
            isOwner[_owners[i]] = true;
            ownerCount += 1;
        }
        masterOwner = _owners[0];
        owners = _owners;
        beneficiaryAddress = _beneficiaryAddress;
        odd = _odd;
        outcome = _outcome;
        token = _token;
        _submitSlip(_position, _amount);
    }

    /// @dev Allows an owner to submit and confirm a slip.
    /// @param amount Slip amount.
    /// @param position Slip position.
    function submitSlip(uint256 position, uint256 amount)
        public
        activeBet
        validAddress
    {
        _submitSlip(position, amount);
    }

    /// @dev Allows an owner to submit and confirm a slip.
    /// @param position Slip position.
    /// @return slipId Returns slip ID.
    function _submitSlip(uint256 position, uint256 amount)
        internal
        activeBet
        ownerExists(msg.sender)
        validAddress
        returns (uint slipId)
    {
        uint256 win = 0;
        uint256 newValue = 0;
        if (position == 1) {
            win = amount.mul(odd);
        }
        if (position == 0) {
            win = amount.div(odd);
        }
        newValue = coverUnsealedSlips(amount, win, position);
        slipId = addSlip(msg.sender, amount, win, newValue, position);
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new slip to the slip mapping, if slip does not exist yet.
    /// @param destination Slip destination address.
    /// @param value Slip ether value.
    /// @param win Slip ether win.
    /// @param position Slip position.
    /// @return slipId Returns slip ID.
    function addSlip(address payable destination, uint256 value, uint256 win, uint256 newValue, uint256 position)
        internal
        returns (uint slipId)
    {
        slipId = slipCount;
        slips[slipId] = Slip({
            destination: destination,
            value: value,
            win: win,
            position: position,
            toSeal: newValue,
            executed: false,
            refunded: false
        });
        slipCount += 1;
        emit BetSubmission(slipId);
        if (newValue == 0) {
            emit BetSealed(slipId);
        }
    }

    /// @dev Returns bool for winning slip
    /// @param slipId Slip Id.
    /// @return slipBool Returns bool.
    function isWinnerSlip(uint256 slipId)
        internal
        view
        returns (bool slipBool)
    {
        slipBool = false;
        if (slips[slipId].position == winningPosition) {
            slipBool = true;
        }
    }

    /// @dev Returns bool for sealed slip
    /// @param slipId Slip Id.
    /// @return slipBool Returns bool.
    function isSealedSlip(uint256 slipId)
        internal
        view
        returns (bool slipBool)
    {
        slipBool = false;
        if (slips[slipId].toSeal == 0) {
            slipBool = true;
        }
    }

    /// @dev Allows owner to end the bet.
    /// @param position Position of Bet.
    /// @param data Data of Bet.
    function endBet(uint position, bytes memory data)
        public
        onlyOwner
        activeBet
    {
        isFrozen = true;
        betState = State.Ended;
        emit BetStateChange(msg.sender, betState);
        submitSettlement(position, data);
    }

    /**
     * @dev Release accumulated balance to beneficiary.
     */
    function releaseBet() internal frozenBet isSettled {
        uint256 payment = token.balanceOf(address(this));

        betState = State.Released;
        emit BetStateChange(msg.sender, betState);

        token.transfer(beneficiaryAddress, payment);

        emit BetRelease(beneficiaryAddress, payment);
    }

    /**
     * @dev Refund accumulated balance to destination.
     */
    function refundBet() public frozenBet onlyOwner isEnded {
        for (uint i = 0; i < slipCount; ++i) {
            Slip storage _slip = slips[i];
            uint256 payment = _slip.value;
            _slip.value = 0;
            _slip.refunded = true;
            token.transfer(_slip.destination, payment);
            emit BetRefund(i, _slip.destination, payment);
        }
    }

    /// @dev Allows owner to settle all slips.
    /// @param _winningPosition Winning Position.
    function settle(uint256 _winningPosition)
        internal
        frozenBet
        isEnded
        returns (bool isExecuted)
    {
        isExecuted = false;
        winningPosition = _winningPosition;
        for (uint i = 0; i < slipCount; ++i) {
            executeSlip(i);
        }
        isExecuted = true;
        betState = State.Settled;
        emit BetStateChange(msg.sender, betState);
        releaseBet();
    }


    /// @dev Internal function to execute slip by slipId.
    /// @param slipId Slip ID.
    function executeSlip(uint slipId)
        internal
        notExecutedSlip(slipId)
    {
        if (isWinnerSlip(slipId) && isSealedSlip(slipId)) {
            Slip storage _slip = slips[slipId];
            uint256 slipWin = _slip.win;
            uint256 benePayment = slipWin.mul(gambitFee).div(100);
            uint256 payment = slipWin.sub(benePayment).add(_slip.value);
            _slip.win = 0;
            _slip.executed = true;
            token.transfer(_slip.destination, payment);
            emit BetExecution(slipId, _slip.destination, payment);
        }
    }

    /// @dev Internal Covers unsealed slips
    /// @param value Value of Slip Position.
    /// @param position Unsealed Slip Position.
    function coverUnsealedSlips(uint256 value, uint256 win, uint256 position)
        internal
        activeBet
        returns (uint256 newValue)
    {
        bool isSealed = false;
        newValue = value;
        for (uint i = 0; i<slipCount; i++) {
            if (slips[i].destination == msg.sender) {
                continue;
            }
            if (slips[i].position == position) {
                continue;
            }
            if (slips[i].executed) {
                continue;
            }
            if (slips[i].toSeal > newValue) {
                continue;
            }
            Slip storage slip = slips[i];
            newValue = newValue.sub(slip.toSeal);
            slip.toSeal = 0;
            isSealed = true;
            emit BetSealed(i);
        }
        if (!isSealed) {
            newValue = win;
        }
    }

    /// @dev Allows to add a new owner. Settlement has to be sent by wallet.
    /// @param owner Address of new owner.
    function addOwner(address owner)
        public
        activeBet
        onlyOwner
        ownerDoesNotExist(owner)
        notNull(owner)
        validRequirement(owners.length + 1, ownerCount)
    {
        isOwner[owner] = true;
        owners.push(owner);
        ownerCount += 1;
        emit SettlementOwnerAddition(owner);
    }

    /// @dev Allows to remove an owner. Settlement has to be sent by wallet.
    /// @param owner Address of owner.
    function removeOwner(address owner)
        public
        activeBet
        onlyOwner
        ownerExists(owner)
        notNull(owner)
    {
        isOwner[owner] = false;
        for (uint i = 0; i < owners.length - 1; i++) {
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        }
        ownerCount -= 1;
        emit SettlementOwnerRemoval(owner);
    }

    /// @dev Allows to replace an owner with a new owner.
    /// @param owner Address of owner to be replaced.
    /// @param newOwner Address of new owner.
    function replaceOwner(address owner, address newOwner)
        public
        activeBet
        onlyOwner
        ownerExists(owner)
        ownerDoesNotExist(newOwner)
    {
        for (uint i = 0; i<owners.length; i++) {
            if (owners[i] == owner) {
                owners[i] = newOwner;
                break;
            }
        }
        isOwner[owner] = false;
        isOwner[newOwner] = true;
        emit SettlementOwnerRemoval(owner);
        emit SettlementOwnerAddition(newOwner);
    }

    /// @dev Returns list of owners.
    /// @return List of owner addresses.
    function getOwners()
        public
        view
        returns (address[] memory)
    {
        return owners;
    }

    /// @dev Allows an owner to submit and confirm a settlement.
    /// @param position Settlement position.
    /// @param data Settlement data payload.
    /// @return settlementId Returns settlement ID.
    function submitSettlement(uint position, bytes memory data)
        public
        frozenBet
        isEnded
        onlyOwner
        returns (uint settlementId)
    {
        if (!settlementPositionExists(position)) {
            settlementId = addSettlement(position, data);
            confirmSettlement(settlementId);
        } else {
            revert('Settlement Position Exists');
        }
    }

    /// @dev Allows an owner to confirm a settlement.
    /// @param settlementId Settlement ID.
    function confirmSettlement(uint settlementId)
        internal
        frozenBet
        isEnded
        onlyOwner
        settlementExists(settlementId)
        notConfirmed(settlementId, msg.sender)
    {
        confirmations[settlementId][msg.sender] = true;
        emit SettlementConfirmation(msg.sender, settlementId);
        executeSettlement(settlementId);
    }

    /// @dev Allows anyone to execute a confirmed settlement.
    /// @param settlementId Settlement ID.
    function executeSettlement(uint settlementId)
        internal
        frozenBet
        onlyOwner
        confirmed(settlementId, msg.sender)
        notExecutedSettlement(settlementId)
    {
        if (isConfirmed(settlementId)) {
            Settlement storage stl = settlements[settlementId];
            stl.executed = true;
            if (settle(stl.position)) {
                emit SettlementExecution(settlementId);
            } else {
                emit SettlementExecutionFailure(settlementId);
                stl.executed = false;
            }
        }
    }

    /// @dev Returns the confirmation status of a settlement.
    /// @param settlementId Settlement ID.
    /// @return hasConfirmed Confirmation status.
    function isConfirmed(uint settlementId)
        internal
        view
        returns (bool hasConfirmed)
    {
        uint count = 0;
        for (uint i = 0; i<owners.length; i++) {
            if (confirmations[settlementId][owners[i]]) {
                count += 1;
            }
            if (count == 1) {
                return true;
            }
        }
    }

    /// @dev Returns the position status of a settlement.
    /// @param position Settlement Position.
    /// @return exists Settlement Exists status.
    function settlementPositionExists(uint position)
        internal
        view
        returns (bool exists)
    {
        for (uint i = 0; i<settlementCount; i++) {
            if (settlements[i].position == position) {
                return true;
            }
        }
        return false;
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new settlement to the settlement mapping, if settlement does not exist yet.
    /// @param position Settlement position.
    /// @param data Settlement data payload.
    /// @return settlementId Returns settlement ID.
    function addSettlement(uint position, bytes memory data)
        internal
        notNull(msg.sender)
        returns (uint settlementId)
    {
        settlementId = settlementCount;
        settlements[settlementId] = Settlement({
            owner: msg.sender,
            position: position,
            data: data,
            executed: false
        });
        settlementCount += 1;
        emit SettlementSubmission(settlementId);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a settlement.
    /// @param settlementId Settlement ID.
    /// @return count Number of confirmations.
    function getConfirmationCount(uint settlementId)
        public
        view
        returns (uint count)
    {
        for (uint i = 0; i<owners.length; i++) {
            if (confirmations[settlementId][owners[i]]) {
                count += 1;
            }
        }
    }

    /// @dev Returns total number of settlements after filers are applied.
    /// @param pending Include pending settlements.
    /// @param executed Include executed settlements.
    /// @return count Total number of settlements after filters are applied.
    function getSettlementCount(bool pending, bool executed)
        public
        view
        returns (uint count)
    {
        for (uint i = 0; i<settlementCount; i++) {
            if (pending && !settlements[i].executed || executed && settlements[i].executed) {
                count += 1;
            }
        }
    }

    /// @dev Returns array with owner addresses, which confirmed settlement.
    /// @param settlementId Settlement ID.
    /// @return _confirmations Returns array of owner addresses.
    function getConfirmations(uint settlementId)
        public
        view
        returns (address[] memory _confirmations)
    {
        address[] memory confirmationsTemp = new address[](owners.length);
        uint count = 0;
        uint i;
        for (i = 0; i<owners.length; i++) {
            if (confirmations[settlementId][owners[i]]) {
                confirmationsTemp[count] = owners[i];
                count += 1;
            }
        }
        _confirmations = new address[](count);
        for (i = 0; i<count; i++)
            _confirmations[i] = confirmationsTemp[i];
    }

    /// @dev Returns list of settlement IDs in defined range.
    /// @param from Index start position of settlement array.
    /// @param to Index end position of settlement array.
    /// @param pending Include pending settlements.
    /// @param executed Include executed settlements.
    /// @return _settlementIds Returns array of settlement IDs.
    function getSettlementIds(uint from, uint to, bool pending, bool executed)
        public
        view
        returns (uint[] memory _settlementIds)
    {
        uint[] memory settlementIdsTemp = new uint[](settlementCount);
        uint count = 0;
        uint i;
        for (i = 0; i<settlementCount; i++) {
            if (pending && !settlements[i].executed || executed && settlements[i].executed) {
                settlementIdsTemp[count] = i;
                count += 1;
            }
        }
        _settlementIds = new uint[](to - from);
        for (i = from; i<to; i++) {
            _settlementIds[i - from] = settlementIdsTemp[i];
        }
    }
}

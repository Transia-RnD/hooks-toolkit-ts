const Hook = (arg) => {
  trace('Base.c: Called.', 0, false)
  return accept('base: Finished.', 0)
}

export { Hook }

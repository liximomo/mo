function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

export default requireUncached;
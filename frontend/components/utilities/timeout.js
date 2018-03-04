export default (func, ms = 0) => new Promise(r => setTimeout(() => r(func()), ms));

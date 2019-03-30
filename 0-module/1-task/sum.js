function sum(a, b) {
  const aNum = Number.parseFloat(a);
  const bNum = Number.parseFloat(b);

  if (isNaN(aNum) || isNaN(bNum)) {
    throw new TypeError();
  }

  return aNum + bNum;
}

module.exports = sum;

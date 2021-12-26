module.exports = function (timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleDateString("fr-FR");
};

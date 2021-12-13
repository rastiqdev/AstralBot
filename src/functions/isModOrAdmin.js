module.exports = {
  isMod(client, member) {
    return (
      member.roles.cache.some(role =>
        client.config.mods.roles.includes(role.id)
      ) || client.config.mods.user.includes(member.id)
    );
  },
  isAdmin(client, member) {
    return (
      member.roles.cache.some(role =>
        client.config.admins.roles.includes(role.id)
      ) ||
      client.config.admins.user.includes(member.id) ||
      member.permissions.has("ADMINISTRATOR")
    );
  },
};

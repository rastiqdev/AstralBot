module.exports = async function(channel) {
    const messages = await fetchAllMessages(channel)
    const content = `${messages.filter(msg => msg.content).length} messages\n\n\n` + messages.filter(msg => msg.content)
        .map(msg => {
            const date = new Date(msg.createdTimestamp)
            return `(${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()})[${msg.author.tag}] ${msg.content}`
        }).join("\n")
    return Buffer.from(content, "utf-8")
}

async function fetchAllMessages(channel, messages) {
    if (!messages) {
        messages = Array.from((await channel.messages.fetch({ limit: 100 })).values())
        if (messages.length < 100) return messages.reverse()
        return await fetchAllMessages(channel, messages.reverse())
    }
    const size = messages.length
    messages = messages.concat(Array.from(
        (await channel.messages.fetch({ limit: 100, before: messages[messages.length - 1].id })).values()))
    if (messages.length === size || messages.length < size + 100) return messages.reverse()
    return await fetchAllMessages(channel, messages.reverse())
}

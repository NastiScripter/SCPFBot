const Configs = require("./botsettings.json")
const Discord = require("discord.js")
const bot = new Discord.Client({disableMentions: "everyone"})
const commands = require("./commands.js")
var kickStorage = []
bot.on("ready", async() => {
    console.log("i am ready!")
    try {
    let link = await bot.generateInvite(["ADMINISTRATOR"])
    console.log(link)
    } catch(e) {
        console.log(e.stack)
    }
})

bot.on("message", async message => {
    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (message.content.slice(0,1) === Configs.prefix) {
        let command = commands[message.content.split(" ")[0].slice(1)]
        if (command) {
            command(message)
            console.log("Command executed.")
        }
    }
})
/*
bot.on("guildMemberRemove", async GuildMember => {
    let channel = GuildMember.guild.channels.cache.find(ch => ch.name === "logs")
    let kicked = false
    let banned = false
    let author
    GuildMember.guild.fetchAuditLogs({type:"MEMBER_KICK",limit:1})
    .then(function(entry){
        entry.entries.forEach(function(instance){
            if (instance.target === GuildMember.user) {
                kicked = true
                author = instance.executor
            }
        })
        if (kicked === true) {
            channel.send(`<@250017573037408256>: ${GuildMember.user.username} foi kickado por ${author.username}`)
            var memberpos = kickStorage.push(author.username)
            setTimeout(() => {
                kickStorage.splice(author.username,1)
                console.log(`perdoei o ${author.tag}`)
            }, 10000);
        } else {
            channel.send(`${GuildMember.user.username} saiu do servidor.`)
        }
        let kickindex = kickStorage.splice(author.username)
        console.log(kickindex.length)
        if (kickindex.length >= 3) {
            console.log(`esse aqui vai toma ${author.tag}`)
            if (GuildMember.guild.member(author).bannable) {
                GuildMember.guild.member(author).ban({reason: "tomo"})
                .then(console.log)
                .catch(console.error)
            }
        } else {
            kickStorage = kickStorage.concat(kickindex)
        }
    })
    GuildMember.guild.fetchAuditLogs({type:"MEMBER_BAN_ADD",limit:1})
    .then(function(entry){
        entry.entries.forEach(function(instance){
            if (instance.target === GuildMember.user) {
                banned = true
                author = instance.executor
            }
        })
        if (banned === true) {
            channel.send(`<@250017573037408256>: ${GuildMember.user.username} foi banido por ${author.username}`)
            var memberpos = kickStorage.push(author.username)
            setTimeout(() => {
                kickStorage.splice(author.username,1)
                console.log(`perdoei o ${author.tag}`)
            }, 10000);
        } else {
            channel.send(`${GuildMember.user.username} saiu do servidor.`)
        }
        let kickindex = kickStorage.splice(author.username)
        console.log(kickindex.length)
        if (kickindex.length >= 3) {
            console.log(`esse aqui vai toma ${author.tag}`)
            if (GuildMember.guild.member(author).bannable) {
                GuildMember.guild.member(author).ban({reason: "tomo"})
                .then(console.log)
                .catch(console.error)
            }
        } else {
            kickStorage = kickStorage.concat(kickindex)
        }
    })
    .catch(console.error)
})
*/
bot.on("guildMemberRemove"), async GuildMember => {
    let actedon
    GuildMember.guild.fetchAuditLogs({limit: 1})
    .then(function(entry){
        entry.entries.forEach(function(instance){
            if (instance.action === "MEMBER_KICK" || instance.action === "MEMBER_BAN_ADD") {
                if (instance.target === GuildMember.user) {
                    actedon = true
                    actor = instance.executor
                }
            }
        })
    })
    if (actedon) {
        let channel = GuildMember.guild.channels.cache.find(ch => ch.name === 'logs')
        if (!channel) return
        channel.send(`${GuildMember.user.tag} foi removido por ${actor.tag}`)
        kickStorage.push(actor.tag)
        setTimeout(() => {
            kickStorage.splice(actor.tag,1)
        }, 10000);
    }
}

bot.login(Configs.token)
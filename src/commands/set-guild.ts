import {Message} from "discord.js";
import {Account} from "../models/account";
import {prefix} from "../util/constants";

module.exports = {
    name: 'setGuild',
    description: `Setup a public classic guild bank account: \`${prefix}setGuild YOUR_GUILD_ID\``,
    async execute(message: Message, args: string[]) {
        const guildId = args[0];
        if (!guildId) {
            await message.reply("No Guild Id provided, please provide a valid Guild Id: `!gb:setGuild YOUR_GUILD_ID`");
            return;
        }
        const account = new Account();
        account.classicGuildBankId = guildId;
        account.discordGuildId = message.guild.id;
        account.isPublic = true;
        await account.save();

        await message.delete();
        await message.channel.send("Guild Bank configured: type '!gb:help' to see list of commands.\nHappy raiding :)");
    },
};

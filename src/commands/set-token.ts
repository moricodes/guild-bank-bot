import { Message } from "discord.js";
import { Account } from "../models/account";
import { ApiRequest } from "../api/guild-bank.api";

module.exports = {
    name: 'setToken',
    description: 'Setup a private classic guild bank account: `!gb:setToken API_TOKEN`',
    async execute(message: Message, args: string[]) {
        const token = args[0];
        const guildId = await getGuildIdByToken(token);
        if (!guildId) {
            await message.reply("Cannot get Guild Id, please provide a valid token!");
            return;
        }
        const account = new Account();
        account.discordGuildId = message.guild.id;
        account.classicGuildBankId = guildId;
        account.apiToken = token;
        account.isPublic = false;
        await account.save();
        await message.delete();
        await message.channel.send("Guild Bank configured: type `!gb:help` to see list of commands.\nHappy raiding :)");
    },
};


const getGuildIdByToken = async (apiToken: string) => {
    return new ApiRequest().withToken(apiToken).getGuildId();
}

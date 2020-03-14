import * as Discord from "discord.js";
import {Message} from "discord.js";
import {ApiRequest} from "../api/guild-bank.api";
import {Account} from "../models/account";

module.exports = {
    name: 'inventory',
    description: 'Get complete guild bank inventory report',
    async execute(message: Message, args: string[]) {
        const account = await Account.findByDiscordId(message.guild.id);
        const items = await new ApiRequest().forAccount(account).getItems();
        const chunk = 25;
        let parts = 1;
        for (let i = 0; i < items.length; i += chunk) {
            const responseMsg = new Discord.RichEmbed().setTitle(`Guild Bank Inventory - Part #${parts}`);
            const tmpResponse = items.slice(i, i + chunk);
            tmpResponse.forEach((res) => responseMsg.addField(res.name, `${res.quantity} x`, true));
            await message.channel.send(responseMsg);
            parts++;
        }
        await message.delete();
    },
};

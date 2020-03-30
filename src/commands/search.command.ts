import * as Discord from "discord.js";
import { Message } from "discord.js";
import { ApiRequest } from "../api/guild-bank.api";
import { Account } from "../models/account";
import { prefix } from "../util/constants";
import { BaseCommand } from "./base.command";

export class SearchCommand extends BaseCommand {

    public readonly name = "search";

    public description = "Find specific item in inventory";

    public usage = `${prefix}${this.name} ITEM_NAME/ITEM_ID`

    public offizerOnly = true;

    public async action(message: Message, args: string[]) {
        const searchString = args.join(' ');
        const account = await this.getAccount();
        const items = await new ApiRequest().forAccount(account).getItems();
        const result = items.filter(i => {
            return i.name.toLowerCase().includes(searchString.toLowerCase()) || i.id.toString() == searchString;
        });
        if (result.length === 0) {
            await message.channel.send(`No search result for '${searchString}'`);
            return;
        }
        const responseMsg = new Discord.RichEmbed().setTitle(`Guild Bank Inventory - Search Result for '${searchString}'`);
        result.forEach(r => {
            responseMsg.addField(`${r.name} [Id: ${r.id}]`, `${r.quantity}x`);
        });
        await message.channel.send(responseMsg);
    }
}



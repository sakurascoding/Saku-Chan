/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbedField, Role } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { logGuildEvent } from "../utils/guilds";
import { camelToTitleCase } from "../utils/strings";

class RoleUpdateListener extends Listener<"roleUpdate"> {
    constructor() {
        super("roleUpdate");
    }

    public async exec(oldRole: Role, newRole: Role): Promise<void> {
        const logFields: APIEmbedField[] = [
            {
                name: "Name",
                value: oldRole.name === newRole.name ? newRole.name : `${ oldRole.name } ➜ **${ newRole.name }**`,
                inline: true,
            },
            {
                name: "ID",
                value: newRole.id,
                inline: true,
            },
        ];

        if (!newRole.permissions.equals(oldRole.permissions)) {
            logFields.concat(
                {
                    name: "Assigned Permissions",
                    value: oldRole.permissions.missing(newRole.permissions).map(r => camelToTitleCase(r)).join(", "),
                },
                {
                    name: "Revoked Permissions",
                    value: newRole.permissions.missing(oldRole.permissions).map(r => camelToTitleCase(r)).join(", "),
                },
            );
        }

        await logGuildEvent(newRole.guild, {
            color: newRole.color,
            title: "Role Updated",
            fields: logFields,
            thumbnail: {
                url: newRole.iconURL(),
            },
            timestamp: new Date().toISOString(),
        });
    }
}

export = RoleUpdateListener;

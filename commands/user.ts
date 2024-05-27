// @ts-nocheck
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import moment from "moment";

//set moment locale to pt-br
moment.locale("pt-br");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Quem é essa pessoa?")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("O nome de usuário  / maluca")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild

        // if the user is not in a guild, interaction.member will be null

        const inputUser = interaction.options.get("usuario");

        await interaction.reply(
            `Essa pessoa é ${
                inputUser?.user?.username
            }, e entrou no servidor ${moment(
                //@ts-ignore
                //joined at
                inputUser?.member?.joinedAt
            ).format(
                "[às] HH[h] [e] mm[min], [de] DD/MM/YYYY"
                //@ts-ignore
            )}, ou seja, ${moment(inputUser?.member?.joinedAt).fromNow()}`
        );
    }
};

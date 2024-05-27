// comando que recebe um parâmetro numérico e roda um dado com o número de lados igual ao parâmetro, o máximo de lados deve ser 20
//

// @ts-nocheck
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rodar")
        .setDescription(
            "Roda um dado com o número de lados igual ao parâmetro."
        )
        .addIntegerOption(option =>
            option
                .setName("lados")
                .setDescription("Número de lados do dado.")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        if (
            isNaN(interaction.options.getInteger("lados")) ||
            interaction.options.getInteger("lados") > 20 ||
            interaction.options.getInteger("lados") < 6
        )
            return interaction.reply(
                "O número de lados deve ser um número inteiro entre 6 e 20."
            );
        const lados = interaction.options.getInteger("lados");
        const resultado = Math.floor(Math.random() * lados) + 1;
        const reply = `${interaction.user} rolou o D${lados}! Resultado: **${resultado}**`;
        await interaction.reply(reply);
    }
};

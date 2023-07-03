const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cmd: new SlashCommandBuilder()
    .setName('help-tracker')
    .setDescription('Affiche comment se servir de la commande /tracker'),
  async execute(interaction) {
    const embed = {
      color: 0x6495ED,  
      title: 'Comment se servir de la commande /tracker',
      description:
        'Pour se servir de la commande /tracker, il faut entrer le jeu sur lequel vous voulez récupérer les stats, le pseudo du joueur ainsi que son #.',
      fields: [
        {
          name: 'Exemple /tracker',
          value: '/tracker Valorant Fafuke#0001',
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Squad Tracker',
      },
    };
    await interaction.reply({ embeds: [embed] });
  },
};

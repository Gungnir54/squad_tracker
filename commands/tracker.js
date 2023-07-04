const { SlashCommandBuilder } = require('discord.js');

const cmd = new SlashCommandBuilder()
  .setName('tracker')
  .setDescription('Affiche comment se servir de la commande /tracker')
  .addStringOption((option) =>
    option
      .setName('jeu')
      .setDescription('Le jeu sur lequel vous voulez récupérer les stats.')
      .addChoices(
        { name: 'League of Legends', value: 'League of Legends' },
        { name: 'Teamfight Tactics', value: 'Teamfight Tactics' },
        { name: 'Valorant', value: 'Valorant' }
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('pseudo')
      .setDescription('Le pseudo du joueur dont vous voulez récupérer les stats.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('tag')
      .setDescription('Le tag du joueur dont vous voulez récupérer les stats **(Valorant uniquement)**.')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('region')
      .setDescription('La région du joueur dont vous voulez récupérer les stats **(LOL et TFT)**.')
      .addChoices(
        { name: 'EUW', value: 'EUW' },
        { name: 'EUNE', value: 'EUNE' },
        { name: 'NA', value: 'NA' },
        { name: 'KR', value: 'KR' },
        { name: 'JP', value: 'JP' },
        { name: 'OCE', value: 'OCE' },
        { name: 'BR', value: 'BR' },
        { name: 'LAN', value: 'LAN' },
        { name: 'LAS', value: 'LAS' },
        { name: 'RU', value: 'RU' },
        { name: 'TR', value: 'TR' }
      )
      .setRequired(false)
  );

module.exports = {
  cmd,
  async execute(interaction) {
    const jeu = interaction.options.getString('jeu');
    const pseudo = interaction.options.getString('pseudo');
    const tag = interaction.options.getString('tag');
    const region = interaction.options.getString('region');
    const dmChannel = await interaction.user.createDM();
    let concatPseudo = pseudo;
    let editJeu = jeu.toLowerCase();

    if (jeu == 'Valorant') {
      if (!tag) {
        return await dmChannel.send('Veuillez fournir le champ "tag" dans les options.');
      }
      concatPseudo = pseudo + '%23' + tag;
    } else {
      if (jeu == 'League of Legends') {
        editJeu = 'lol';
      } else if (jeu == 'Teamfight Tactics') {
        editJeu = 'tft';
      }
      if (region) {
        concatPseudo = region + '/' + pseudo;
      } else {
        return await dmChannel.send('Veuillez fournir le champ "region" dans les options.');
      }
    }

    const embed = {
      color: 0x6495ED,
      title: `Stats de ${pseudo} sur ${jeu} pour cette saison :`,
      fields: [
        {
          name: '',
          value: `https://tracker.gg/${editJeu}/profile/riot/${concatPseudo}/overview`,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Squad Tracker',
      },
    };

    await interaction.reply({ content: 'Veuillez patienter pendant que je récupère les informations...', ephemeral: true });

    const sendPrivateMessage = async () => {
      try {
        await dmChannel.send({ embeds: [embed] });
        setTimeout(() => {
          interaction.deleteReply();
        }, 2000);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message privé :', error);
        interaction.reply({ content: 'Une erreur est survenue lors de la récupération des informations, veuillez réessayer plus tard.', ephemeral: true });
      }
    };

    sendPrivateMessage();
  },
};

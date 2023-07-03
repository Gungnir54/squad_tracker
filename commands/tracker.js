const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cmd: new SlashCommandBuilder()
    .setName('tracker')
    .setDescription('Affiche comment se servir de la commande /tracker')
    .addRoleOption((option) =>
      option
        .setName('jeu')
        .setDescription('Le jeu sur lequel vous voulez récupérer les stats.')
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
        .setDescription('Le tag du joueur dont vous voulez récupérer les stats.')
        .setRequired(false)
    ),
  async execute(interaction) {
    const jeu = interaction.options.getRole('jeu');
    const pseudo = interaction.options.getString('pseudo');
    const tag = '%23' + interaction.options.getString('tag');
    let concatPseudo = pseudo;
    let editJeu = jeu.name.toLowerCase();

    if (jeu.name == 'League of Legends') {
      concatPseudo = 'EUW/' + pseudo;
      editJeu = 'lol';
    } else if (jeu.name == 'Teamfight Tactics') {
      concatPseudo = 'EUW/' + pseudo;
      editJeu = 'tft';
    }

    if (jeu.name === 'Valorant') {
      concatPseudo = pseudo + tag;
    }

    const embed = {
      color: 0x6495ED,
      title: `Stats de ${pseudo} sur ${jeu.name} :`,
      fields: [
        {
          name: 'URL vers le site de tracking :',
          value: `https://tracker.gg/${editJeu}/profile/riot/${concatPseudo}/overview`,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Squad Tracker',
      },
    };

    await interaction.reply('Veuillez patienter pendant que je récupère les informations...');

    const sendPrivateMessage = async () => {
      try {
        const dmChannel = await interaction.user.createDM();
        await dmChannel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message privé :', error);
      }
    };

    sendPrivateMessage();
    setTimeout(() => {
      interaction.deleteReply();
    }
    , 3000);
  },
};

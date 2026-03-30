// Template de bail meublé classique
// Les placeholders {{...}} seront remplacés par les vraies données lors de la génération

export const TEMPLATE_MEUBLE_CLASSIQUE = {
    id: "meuble_classique",
    nom: "Bail meublé classique",
    articles: {
      identite: {
        titre: "IDENTITÉ DES PARTIES",
        contenu: `Entre les soussignés :
  
  {{BAILLEUR_NOM}}, ci-après « le Bailleur », d'une part,
  
  Et :
  
  {{LOCATAIRE_NOM}}, ci-après « le Locataire », d'autre part,
  
  Pour la compréhension et la simplification de certains termes utilisés aux présentes, il est préalablement déterminé ce qui suit :
  
  « Le Bailleur » et « Le Locataire » désigneront respectivement les personnes identifiées en tête des présentes, sous ces terminologies.
  « Le Bailleur » et « Le Locataire » pourront être désignés individuellement par le terme « la Partie » ou ensemble par le terme « les Parties ».
  « Les Locaux » désigneront les lieux loués, objet des présentes.
  « L'Immeuble » désignera l'immeuble collectif dans lequel sont situés les locaux loués.
  « Le Bail » désignera le présent contrat.
  
  Il a été convenu et arrêté ce qui suit :
  
  Le Bailleur loue au Locataire pour la durée et selon les conditions et clauses indiquées ci-dessous, les locaux meublés à usage d'habitation ci-après désignés, avec les meubles meublants, équipements et objets mobiliers s'y trouvant tels que décrits dans l'inventaire annexé aux présentes.
  
  RÉGIME JURIDIQUE
  
  Le présent contrat est régi par les dispositions des articles 25-3 à 25-4 du Titre I bis de la loi n° 89-462 du 6 juillet 1989.`,
      },
  
      article1: {
        titre: "ARTICLE 1 - DÉSIGNATION - DESCRIPTION DES LOCAUX ET ÉQUIPEMENTS - DESTINATION",
        contenu: `1-1. Adresse des Locaux
  {{BIEN_ADRESSE}}
  
  1-2. Consistance des Locaux
  {{BIEN_DESCRIPTION}}
  
  Type d'habitat : {{BIEN_TYPE}}
  
  1-3. Désignation des équipements privatifs
  Le local dispose des équipements mentionnés dans l'état des lieux joint à ce contrat.
  
  1-4. Modalités de production de chauffage
  Les Locaux sont chauffés par un système individuel.
  
  1-5. Modalités de production d'eau chaude sanitaire
  Les Locaux sont alimentés en eau chaude sanitaire par un système individuel.
  
  1-6. Notion de logement décent
  Le Bailleur déclare que les Locaux correspondent aux caractéristiques du logement décent telles que définies par le décret 2002-120 du 30 janvier 2002.`,
      },
  
      article2: {
        titre: "ARTICLE 2 - DURÉE DU CONTRAT",
        contenu: `Le présent bail est consenti et accepté pour une durée de {{DUREE}} mois, prenant effet le {{DATE_DEBUT}}.
  
  Le bail expirera donc le {{DATE_FIN}}.`,
      },
  
      article3: {
        titre: "ARTICLE 3 - TACITE RECONDUCTION",
        contenu: `À défaut de congé donné par l'une ou l'autre des Parties et dans les conditions ci-après, le présent bail sera reconduit tacitement pour une durée d'un an.
  
  Le contrat reconduit produira les mêmes effets que le contrat initial, aux clauses et conditions du présent bail.`,
      },
  
      article4: {
        titre: "ARTICLE 4 - RENOUVELLEMENT AVEC MODIFICATION",
        contenu: `Lorsque le Bailleur souhaite, à l'expiration du contrat, en renouveler les conditions, il notifie au Locataire une offre de renouvellement, dans les conditions prévues par la loi.
  
  En cas de désaccord ou à défaut de réponse du Locataire dans un délai de quatre mois à compter de la date d'envoi de la lettre de proposition, l'une ou l'autre des Parties peut saisir la Commission départementale de conciliation territorialement compétente.`,
      },
  
      article5: {
        titre: "ARTICLE 5 - CONGÉ",
        contenu: `Le congé doit être notifié par lettre recommandée avec demande d'avis de réception ou signifié par acte de commissaire de justice ou remis en main propre contre récépissé ou émargement.
  
  5-1. Congé émanant du Locataire
  Le congé émanant du Locataire n'a pas à être justifié ni motivé. Il peut être délivré à tout moment par le Locataire en respectant un préavis d'un mois, courant à compter de la réception de la lettre recommandée, de la signification de l'acte ou de la remise en main propre.
  
  5-2. Congé émanant du Bailleur
  Le congé délivré par le Bailleur ne peut être donné que pour le terme du contrat initial ou reconduit ou renouvelé en respectant un préavis de trois mois. Le Bailleur doit justifier du caractère réel et sérieux de sa décision de reprise.
  
  Le congé du Bailleur doit être justifié :
  - Soit par la reprise des Locaux,
  - Soit par la vente des Locaux,
  - Soit par un motif légitime et sérieux notamment l'inexécution par le Locataire d'une des obligations lui incombant.
  
  À peine de nullité, le congé donné par le Bailleur doit indiquer le motif allégué et, en cas de reprise, les nom et adresse du bénéficiaire de la reprise ainsi que la nature du lien existant entre le Bailleur et le bénéficiaire de la reprise qui ne peut être que le Bailleur, son conjoint, le partenaire auquel il est lié par un PACS enregistré à la date du congé, son concubin notoire depuis au moins un an à la date du congé, ses ascendants, ses descendants ou ceux de son conjoint, de son partenaire ou de son concubin.
  
  5-3. Paiement du loyer pendant la durée du préavis
  Pendant le délai de préavis :
  - Si le congé émane du Bailleur, le Locataire n'est redevable du loyer et des charges que pour le temps où il a occupé réellement les Locaux.
  - Si le congé émane du Locataire, celui-ci est redevable du loyer et des charges pendant tout le délai de préavis, sauf si les Locaux se trouvent occupés avant la fin du préavis par un autre locataire en accord avec le Bailleur.`,
      },
  
      article6: {
        titre: "ARTICLE 6 - PAIEMENT DU LOYER",
        contenu: `6.1 Le loyer
  Le montant du loyer encadré est fixé à {{LOYER_ENCADRE}} euros.
  Le montant du complément de loyer est fixé à {{COMPLEMENT_LOYER}} euros.
  Le montant des charges est fixé à {{CHARGES}} euros.
  Le montant total du loyer charges comprises est fixé à {{LOYER_TOTAL}} euros.
  
  6.2 Paiement du loyer
  Le loyer est payable mensuellement et d'avance, au domicile du Bailleur ou de son représentant, à terme à échoir, et pour la première fois le {{DATE_DEBUT}}.
  
  6.3 Révision du loyer
  a) Date de révision : Date anniversaire du contrat.
  b) L'indice de référence des loyers (IRL) applicable est celui en vigueur à la date de révision.`,
      },
  
      article7: {
        titre: "ARTICLE 7 - CHARGES ET TAXES",
        contenu: `7.1 Modalité de règlement des charges récupérables : récupération des charges par le Bailleur sous la forme d'un forfait.
  
  7.2 Montant du forfait de charges : {{CHARGES}} euros.
  
  7.3 Modalités de révision du forfait de charges : le forfait des charges peut être indexé chaque année comme le loyer.`,
      },
  
      article8: {
        titre: "ARTICLE 8 - DÉPÔT DE GARANTIE",
        contenu: `À titre de garantie de l'entière exécution de ses obligations, le Locataire verse, ce jour, une somme de {{CAUTION}} euros correspondant à deux mois de loyer en principal.
  
  Ce dépôt ne sera pas productif d'intérêts et ne sera pas révisable au cours de la présente location.
  
  Ce dépôt ne sera en aucun cas imputable sur les loyers, charges et accessoires dus et ne dispense en aucun cas le Locataire du paiement du loyer et des charges aux dates fixées.
  
  Ce dépôt sera restitué au Locataire en fin de bail et dans un délai maximum de un mois à compter de la remise en main propre, ou par lettre recommandée avec demande d'avis de réception, des clés au Bailleur ou à son mandataire, déduction faite, le cas échéant, des sommes restant dues au Bailleur et des sommes dont celui-ci pourrait être tenu, aux lieu et place du Locataire, sous réserve qu'elles soient dûment justifiées.
  
  Le délai de restitution de la somme versée à titre de garantie est toutefois réduit à un mois lorsque l'état des lieux de sortie est conforme à l'état des lieux d'entrée.
  
  Si la somme ainsi versée à titre de garantie s'avérait être insuffisante, le Locataire réglerait toute somme complémentaire sur présentation des justificatifs par le Bailleur et ce dans les 10 jours de la demande faite par le Bailleur.`,
      },
  
      article9: {
        titre: "ARTICLE 9 - OBLIGATIONS DU LOCATAIRE",
        contenu: `Le Locataire est tenu des principales obligations suivantes :
  
  - De payer le loyer et les charges aux termes convenus.
  - D'user paisiblement des Locaux suivant la destination contractuelle.
  - De répondre des dégradations et pertes qui surviendraient pendant la durée du Bail dans les locaux dont il a la jouissance exclusive, à moins qu'il ne prouve qu'elles ont eu lieu par cas de force majeure, par la faute du Bailleur ou par le fait d'un tiers qu'il n'a pas introduit dans le logement.
  - De prendre à sa charge l'entretien courant du logement, des équipements mentionnés à l'article 1 et les menues réparations ainsi que l'ensemble des réparations locatives définies par décret en Conseil d'État, sauf si elles sont occasionnées par vétusté, malfaçon, vice de construction, cas fortuit ou de force majeure.
  - D'utiliser les mobiliers, équipements, matériels et objets garnissant les Locaux selon l'usage auquel ils sont destinés et de les laisser dans les lieux où ils se trouvent.
  - D'entretenir les mobiliers, équipements, matériels et objets compris dans la location en bon état et de les rendre de même en fin de Bail.
  - De n'effectuer aucuns travaux ni aucune transformation ou modification des lieux et des équipements sans l'accord préalable et par écrit du Bailleur.
  - De permettre l'accès des Locaux pour la préparation et l'exécution de travaux d'amélioration des parties communes ou privatives de l'Immeuble.
  - De s'assurer contre les risques dont il doit répondre en sa qualité de locataire et d'en justifier lors de la remise des clés puis, chaque année, à la demande du Bailleur.
  - Lors de la sortie, de rendre les Locaux propres et débarrassés de tous effets personnels.
  - De ne pas sous-louer ni céder ses droits à la présente convention sans le consentement exprès et écrit du Bailleur, à peine de résiliation.
  - D'occuper les Locaux paisiblement et de n'occasionner aucun trouble au voisinage.
  - De signaler sans délai au Bailleur tout dysfonctionnement, toute détérioration quelle qu'en soit la cause.`,
      },
  
      article10: {
        titre: "ARTICLE 10 - OBLIGATIONS DU BAILLEUR",
        contenu: `Le Bailleur est tenu :
  
  - De remettre au Locataire un logement décent ne laissant pas apparaître de risques manifestes pouvant porter atteinte à la sécurité physique ou à la santé, exempt de toute infestation d'espèces nuisibles et parasites, répondant à un critère de performance énergétique minimale et doté des éléments le rendant conforme à l'usage d'habitation.
  - De délivrer au Locataire les Locaux en bon état d'usage et de réparation ainsi que les équipements mentionnés au contrat, en bon état de fonctionnement.
  - D'assurer au Locataire la jouissance paisible des Locaux et de le garantir des vices ou défauts de nature à y faire obstacle.
  - D'entretenir les Locaux en état de servir à l'usage prévu par le contrat et d'y faire toutes les réparations, autres que locatives, nécessaires au maintien en état et à l'entretien normal des Locaux.
  - De ne pas s'opposer aux aménagements réalisés par le Locataire, dès lors que ceux-ci ne constituent pas une transformation de la chose louée.
  - De transmettre gratuitement une quittance au Locataire lorsque celui-ci en fait la demande.`,
      },
  
      article11: {
        titre: "ARTICLE 11 - ASSURANCE",
        contenu: `Le Locataire est tenu de s'assurer auprès d'une compagnie d'assurances notoirement solvable de son choix, contre tous les risques locatifs liés à son occupation et à la jouissance des Locaux et des mobiliers, équipements, matériels et objets les garnissant, à effet au premier jour de la date d'effet des présentes même si le Locataire n'occupe pas effectivement les Locaux à cette date.
  
  Il devra justifier de la souscription de cette assurance et des risques garantis à la remise des clés, par la remise entre les mains du Bailleur ou de son mandataire d'une attestation émanant de la compagnie.
  
  Ces garanties devront être maintenues durant toute la durée des présentes et jusqu'au départ effectif du Locataire des Locaux.`,
      },
  
      article12: {
        titre: "ARTICLE 12 - DOSSIER DE DIAGNOSTIC TECHNIQUE",
        contenu: `Conformément aux dispositions de l'article 3-3 de la loi du 6 juillet 1989, un dossier de diagnostic technique est communiqué au Locataire à son entrée.
  
  Ce dossier comprend :
  - Le diagnostic de performance énergétique prévu à l'article L. 134-1 du Code de la construction et de l'habitation.
  - L'état de l'installation intérieure d'électricité et de gaz.
  - L'état des risques et pollutions prévu à l'article L. 125-5 du Code de l'environnement.
  - Le diagnostic amiante.`,
      },
  
      article13: {
        titre: "ARTICLE 13 - ÉTAT DES LIEUX ET INVENTAIRE DES MOBILIERS, ÉQUIPEMENTS, MATÉRIELS ET OBJETS GARNISSANT LES LOCAUX",
        contenu: `Conformément à l'article 3-2 de la loi du 6 juillet 1989, un état des lieux et un inventaire des mobiliers, équipements, matériels et objets garnissant les Locaux, contradictoires sont établis ce jour et seront annexés au présent contrat.
  
  Un état des lieux et un inventaire seront également établis lors de la restitution des clés par le Locataire.
  
  Si l'état des lieux et l'inventaire ne peuvent être établis dans les conditions prévues, ils seront établis par un commissaire de justice, sur l'initiative de la Partie la plus diligente, à frais partagés par moitié entre le Bailleur et le Locataire.
  
  Le Locataire peut demander au Bailleur ou à son représentant de compléter l'état des lieux d'entrée dans un délai de dix jours à compter de son établissement.`,
      },
  
      article14: {
        titre: "ARTICLE 14 - CLAUSE DE SOLIDARITÉ",
        contenu: `Les Locataires des Locaux seront tenus solidairement et indivisiblement des obligations prévues dans le présent contrat de location et notamment du paiement des loyers et charges.`,
      },
  
      article15: {
        titre: "ARTICLE 15 - CLAUSE RÉSOLUTOIRE",
        contenu: `Le contrat sera résilié de plein droit dans les cas suivants :
  
  - À défaut de paiement de tout ou partie du loyer et des charges aux termes convenus, ou à défaut de versement du dépôt de garantie, et deux mois après un commandement de payer demeuré infructueux, le présent contrat sera résilié immédiatement et de plein droit.
  - Non-respect d'usage paisible des Locaux, résultant de troubles de voisinage constatés par une décision de justice passée en force de chose jugée.
  - Les frais de mise en demeure, les frais de justice et de tous ceux qui en seraient la suite ou la conséquence seront à la charge exclusive du Locataire.`,
      },
  
      article16: {
        titre: "ARTICLE 16 - ÉLECTION DE DOMICILE",
        contenu: `Pour l'exécution des présentes et de leurs suites, les Parties font élection de domicile :
  - Pour le Bailleur, à son adresse telle qu'indiquée en tête des présentes.
  - Pour le Preneur, à l'adresse des Locaux.
  
  En cas de modification, chacune des Parties devra en informer l'autre par lettre recommandée avec demande d'avis de réception dans les 8 jours.`,
      },
  
      article17: {
        titre: "ARTICLE 17 - PIÈCES ANNEXES AU CONTRAT",
        contenu: `- L'état des lieux et l'inventaire des mobiliers, matériels, équipements et objets garnissant les Locaux qui seront établis contradictoirement entre les Parties ou à défaut par un commissaire de justice.
  - Le dossier de diagnostic technique constitué.`,
      },
  
      signature: {
        titre: "SIGNATURES",
        contenu: `Fait à {{LIEU_SIGNATURE}},
  Le {{DATE_GENERATION}}
  
  En 2 originaux dont un est remis à chacune des parties qui le reconnaît.
  
  LE BAILLEUR
  « Lu et approuvé »
  
  
  
  LE LOCATAIRE
  « Lu et approuvé »`,
      },
    },
  };
  
  // Liste des placeholders disponibles avec leur source
  export const PLACEHOLDERS = {
    // Auto — depuis la base de données
    BAILLEUR_NOM: { source: "auto", description: "Nom du bailleur (propriétaire)" },
    LOCATAIRE_NOM: { source: "auto", description: "Nom du locataire" },
    BIEN_ADRESSE: { source: "auto", description: "Adresse du bien" },
    BIEN_TYPE: { source: "auto", description: "Type de logement" },
    BIEN_DESCRIPTION: { source: "auto", description: "Description du bien" },
    CAUTION: { source: "auto", description: "Montant du dépôt de garantie" },
  
    // Formulaire — saisi par l'utilisateur
    DATE_DEBUT: { source: "formulaire", description: "Date de début du bail" },
    DATE_FIN: { source: "formulaire", description: "Date de fin du bail" },
    DUREE: { source: "formulaire", description: "Durée du bail en mois" },
    LOYER_ENCADRE: { source: "formulaire", description: "Montant du loyer encadré" },
    COMPLEMENT_LOYER: { source: "formulaire", description: "Complément de loyer" },
    CHARGES: { source: "formulaire", description: "Montant des charges" },
    LOYER_TOTAL: { source: "formulaire", description: "Loyer total charges comprises" },
  
    // Génération — automatique
    DATE_GENERATION: { source: "auto", description: "Date de génération du bail" },
    LIEU_SIGNATURE: { source: "formulaire", description: "Lieu de signature" },
  } as const;
  
  // Fonction pour remplacer les placeholders dans un template
  export function remplirTemplate(
    articles: Record<string, { titre: string; contenu: string }>,
    donnees: Record<string, string>
  ): Record<string, { titre: string; contenu: string }> {
    const resultat: Record<string, { titre: string; contenu: string }> = {};
  
    for (const [key, article] of Object.entries(articles)) {
      let contenu = article.contenu;
  
      for (const [placeholder, valeur] of Object.entries(donnees)) {
        contenu = contenu.replaceAll(`{{${placeholder}}}`, valeur);
      }
  
      resultat[key] = { titre: article.titre, contenu };
    }
  
    return resultat;
  }
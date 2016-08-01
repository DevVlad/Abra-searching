import { red500, blue500, grey500, orange500, green500, grey900 } from 'material-ui/styles/colors';

import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

const CONSTANTS = {
  FAKEDATA: [ "Justin", "Bieber", "Is", "The", "WORST", "Singer", "Ever" ],
  FAKEENTITY: [
    {
      email: "sdjosfj@dosof.cz",
      firma: "code:      585",
      'firma@ref': "/c/velka/adresar/585",
      'firma@showAs': "      585: nazev",
      funkce: "Majitel",
      id: "4",
      jmeno: "Jeřábek ",
      lastUpdate: "2015-10-23T18:14:45.842+02:00",
      mobil: "602 559 175",
      prijmeni: "",
      tel: ""
    },
    {
      email: "",
      firma: "code:      541",
      'firma@ref': "      541: nazev",
      'firma@showAs': "      700: nazev",
      funkce: "",
      id: "175",
      jmeno: "Absolonová",
      lastUpdate: "2012-03-23T10:45:00.186+01:00",
      mobil: "603859972",
      prijmeni: "",
      tel: "487880136"
    },
    {
      email: "",
      firma: "code:      478",
      'firma@ref': "/c/velka/adresar/478",
      'firma@showAs': "      478: nazev",
      funkce: "",
      id: "107",
      jmeno: "Dana",
      lastUpdate: "2012-02-05T10:44:45.859+01:00",
      mobil: "732968195,603 187 835",
      prijmeni: "Aipldauerová",
      tel: "515225146"
    }
  ],
  COLORS: {
    info: blue500,
    error: red500,
    disabled: grey500,
    warning: orange500,
    pass: green500,
    normal: grey900,
  },
  COMPONENT_ICONS_INLINE_STYLE: {
    first: {
      width: '20px', height: '20px', transform: 'translateX(-20px)'
    },
    second: {
      width: '20px', height: '20px', position: 'absolute', transform: 'translate(-40px, +35px)'
    }
  },

};

export default CONSTANTS;

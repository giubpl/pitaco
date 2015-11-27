(function () {
	 'use strict';
    window.projectNet = window.projectNet || {};
    window.projectNet["allergio"] = {
      centralProject : {
        cx: 480,
        cy: 425,
        img: "img/B943C0108560459E.jpg",
				name: "Allergio app",
				author: {
					name: "Jonathan Carvalhosa",
					area: "Programador",
					img: "img/fulano.jpg"
				},
				availableTags: ["saúde", "nutrição", "frutas", "saudável", "alergia", "allergioévida"],
      },
      branches : [
        {
          id: "branch-similares-allergio",
          filterText: "Similares",
          color: "#3498db",
          cx: 190,
          cy: 405,
          pitacos:
            [
            ]
        },
        {
          id: "branch-texto-allergio",
          filterText: "Imagens",
          color: "#2ecb72",
          cx: 660,
          cy: 430,
          pitacos:
            [
            ]
        },
        {
          id: "branch-icons-allergio",
          filterText: "Teoria - nutrição",
          color: "#f1c40f",
          cx: 513,
          cy: 302,
          pitacos:
            [
              {
                imgs: ["img/fulano.jpg"],
                cx: 551,
                cy: 218,
                text: ""
              },
            ]
        },
				{
          id: "branch-seila-allergio",
          filterText: "Tipos de alergia",
          color: "#e74c3c",
          cx: 513,
          cy: 552,
          pitacos:
            [
              {
                imgs: ["img/fulano.jpg"],
                cx: 551,
                cy: 618,
                text: ""
              },
            ]
        }
      ]
    }
})();

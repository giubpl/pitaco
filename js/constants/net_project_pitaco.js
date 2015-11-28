(function () {
	 'use strict';
    window.projectNet = window.projectNet || {};
    window.projectNet["pitaco"] = {
      centralProject : {
        cx: 480,
        cy: 425,
        img: "img/central_project_dark.svg",
				name: "Projeto Pitaco",
				author: {
					name: "Giulia Bins",
					area: "Designer",
					img: "img/user_profile.jpg"
				},
				availableTags: ["opinião", "amor", "gostei", "naogostei", "faltafazer", "pitacoévida"],
				detailImg: "img/detalhes_do_Projeto_Pitaco.png",
      },
      branches : [
        {
          id: "branch-similares-allergio",
          filterText: "Positivos",
          color: "#1abc9c",
          cx: 310,
          cy: 428,
          pitacos:
            [
              {
                imgs: ["img/FE16967CFCAF933B.jpg", "img/B943C01085604582.jpg"],
								videos: ["https://www.youtube.com/embed/yRwupxDOZn0"],
								tags: ["Video", "Aplicativo", "Pepe"],
								cx: 271,
                cy: 175,
                text: "Acho o projeto sensacional! Um espaço para troca de pitacos é o que todo designer precisa.",
								author: {
									name: "Gabriel Franklin",
									area: "Designer",
									img: "img/users_pitaqueiros/02.jpg"
								}
              },
              {
                cx: 120,
                cy: 440,
                text: "Amei este projeto! Acho que ele é super útil inclusive para a área de direito, no qual várias pessoas precisam compartilhar textos e escrever textos em conjunto",
								author: {
									name: "Amanda Muniz",
									area: "Advogada",
									img: "img/users_pitaqueiros/05.jpg"
								}
              },
            ]
        },
        {
          id: "branch-texto-allergio",
          filterText: "Negativos",
          color: "#e74c3c",
          cx: 660,
          cy: 430,
          pitacos:
            [
              {
                cx: 807,
                cy: 458,
                text: "Acho que o visual poderia ser melhor. Estava pensando que poderia haver algum tipo de feed dos pitacos mais recentes, como uma forma diferenciada do usuário visualizar as informações relevantes a ele.",
								author: {
									name: "Lucas Abdack",
									area: "Designer",
									img: "img/users_pitaqueiros/01.jpg"
								},
								pitacos: [
									{
		                cx: 853,
		                cy: 506,
		                text: "Concordo 100%",
										author: {
											name: "Gabriel Franklin",
											area: "Designer",
											img: "img/users_pitaqueiros/02.jpg"
										}
		              },
									{
		                cx: 927,
										cy: 433,
		                text: "Discordo 100%",
										author: {
											name: "Amanda Muniz",
											area: "Advogada",
											img: "img/users_pitaqueiros/05.jpg"
										}
		              },
								]
              },
              {
                cx: 723,
                cy: 306,
                text: "Gostei bastante do projeto, mas ainda existem muitas funcionalidades que deveriam ser implementadas. Uma funcionalidade que acharia interessante seria um chat para que os usuários se comunicassem para combinar detalhes do projeto",
								author: {
									name: "Fulana de tal",
									area: "Designer",
									img: "img/users_pitaqueiros/03.jpg"
								}
              },
            ]
        },
      ]
    }
})();

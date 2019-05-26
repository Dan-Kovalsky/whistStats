import {whistStore} from "./src/stores/allGamesStore";

const whistGame =
{
  "games": [
    {
      "date": "11/11/2011",
      "gameId": "game1",
      "Players": [
        {
          "playerId": "304957913",
          "name": "Dan"
        },
        {
          "playerId": "2764423",
          "name": "Samir"
        },
        {
          "playerId": "304213",
          "name": "Eyal"
        },
        {
          "playerId": "303232913",
          "name": "Gal"
        }
      ],
      "rounds": [
        {
          "name": "round1",
          "biddings": [
            3, 4, 7, 0
          ],
          "results": [
            3, 3, 7, 0
          ]
        },
        {
          "name": "round2",
          "biddings": [
            2, 5, 3, 2
          ],
          "results": [
            3, 5, 4, 1
          ]
        }
      ]
    },

    {
      "date": "12/12/2022",
      "gameId": "game2",
      "Players": [
        {
          "playerId": "304957913",
          "name": "Dan"
        },
        {
          "playerId": "2764423",
          "name": "Samir"
        },
        {
          "playerId": "304213",
          "name": "Eyal"
        },
        {
          "playerId": "303232913",
          "name": "Gal"
        }
      ],
      "rounds": [
        {
          "name": "round1",
          "biddings": [
            3, 4, 7, 0
          ],
          "results": [
            3, 3, 7, 0
          ]
        },
        {
          "name": "round2",
          "biddings": [
            2, 5, 3, 2
          ],
          "results": [
            3, 5, 4, 1
          ]
        }
      ]
    }
  ]
}

export function fetchWhistGame() {
  whistStore.setFakeWhistGame(whistGame)

}

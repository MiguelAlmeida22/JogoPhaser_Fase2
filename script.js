// Cena do Menu: exibe o menu inicial e aguarda o clique para iniciar o jogo
class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        // Carrega imagens do botão de início e do fundo do menu
        this.load.image('startButton', 'assets/start.png');
        this.load.image('backgroundMenu', 'assets/background_menu.png');
    }

    create() {
        // Adiciona o fundo e o título do jogo
        this.add.image(400, 300, 'backgroundMenu');
        this.add.text(250, 100, "Jogo do Labirinto", { fontSize: "48px", fill: "#fff" });
        // Cria o botão de início e define o evento de clique para iniciar a cena do jogo
        let startButton = this.add.image(400, 400, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

// Cena do Jogo (Fase 1)
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0;
        this.hasKey = false;
    }

    preload() {
        // Carrega os assets dos personagens, chave, inimigo, porta, mapa e fundo
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.image('backgroundGame', 'assets/background_game.png');
    }

    create() {
        // Adiciona o fundo e cria o mapa a partir do JSON carregado
        this.add.image(400, 300, 'backgroundGame');
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset", "tiles");
        map.createLayer("Ground", tileset, 0, 0);
        
        // Cria o jogador com física, permitindo colisões com os limites do mundo e um leve bounce
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        
        // Gera a chave em posição aleatória
        this.spawnKey();
        // Cria a porta e verifica sobreposição com o jogador para mudar de cena
        this.door = this.physics.add.sprite(500, 200, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
        
        // Cria o inimigo com movimento e colisão com os limites
        this.enemy = this.physics.add.sprite(400, 200, 'enemy');
        this.enemy.setVelocity(100, 100);
        this.enemy.setBounce(1, 1);
        this.enemy.setCollideWorldBounds(true);

        // Exibe o placar na tela
        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        // Verifica sobreposição entre o jogador e a chave para coletá-la
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        // Se o jogador colidir com o inimigo, a cena de game over é iniciada
        this.physics.add.overlap(this.player, this.enemy, () => {
            this.scene.start('GameOverScene');
        });

        // Configura os controles via teclado
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Reseta a velocidade do jogador a cada frame e atualiza de acordo com as teclas pressionadas
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }

    // Função para gerar a chave em posição aleatória
    spawnKey() {
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    // Função chamada ao coletar a chave: atualiza o placar e define que o jogador possui a chave
    collectKey(player, key) {
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    // Função para entrar na porta; só permite se a chave tiver sido coletada
    enterDoor(player, door) {
        if (this.hasKey) {
            this.scene.start('GameScene2');
        }
    }
}

// Cena do Jogo (Fase 2)
class GameScene2 extends Phaser.Scene {
    constructor() {
        super("GameScene2");
        this.score = 0;
        this.hasKey = false;
    }

    preload() {
        // Carrega os assets da segunda fase: jogador, chave, inimigos, porta, novo mapa e fundo
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('tiles2', 'assets/tileset.png');
        this.load.image('backgroundGame2', 'assets/background_game2.png');
    }

    create() {
        // Fundo, mapa e título da fase
        this.add.image(400, 300, 'backgroundGame2');
        const map = this.make.tilemap({ key: "map2" });
        const tileset = map.addTilesetImage("tileset", "tiles2");
        map.createLayer("Tile Layer 1", tileset, 0, 0);
        this.add.text(100, 50, "Fase 2 - Novo Desafio", { fontSize: "32px", fill: "#fff" });

        // Criação e configuração do jogador
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // Gera a chave
        this.spawnKey();

        // Cria a porta em posição diferente e define a sobreposição para entrar nela
        this.door = this.physics.add.sprite(700, 500, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);

        // Criação dos inimigos com diferentes velocidades e trajetórias
        this.enemy = this.physics.add.sprite(400, 300, 'enemy');
        this.enemy.setVelocity(100, 100);
        this.enemy.setBounce(1, 1);
        this.enemy.setCollideWorldBounds(true);

        this.enemy2 = this.physics.add.sprite(200, 500, 'enemy');
        this.enemy2.setVelocity(120, 80);
        this.enemy2.setBounce(1, 1);
        this.enemy2.setCollideWorldBounds(true);

        this.enemy3 = this.physics.add.sprite(600, 150, 'enemy');
        this.enemy3.setVelocity(-80, 120);
        this.enemy3.setBounce(1, 1);
        this.enemy3.setCollideWorldBounds(true);

        // Placar da fase
        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        // Configura a sobreposição para coletar a chave
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);

        // Colisões com inimigos levam ao fim do jogo (GameOver)
        this.physics.add.overlap(this.player, this.enemy, () => {
            this.scene.start('GameOverScene');
        });
        this.physics.add.overlap(this.player, this.enemy2, () => {
            this.scene.start('GameOverScene');
        });
        this.physics.add.overlap(this.player, this.enemy3, () => {
            this.scene.start('GameOverScene');
        });

        // Configura os controles do jogador
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Atualiza o movimento do jogador conforme as teclas pressionadas
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }

    // Gera a chave em posição aleatória, removendo a anterior se existir
    spawnKey() {
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    // Ao coletar a chave, atualiza o placar e define que a chave foi coletada
    collectKey(player, key) {
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    // Ao chegar na porta com a chave, o jogador avança para a cena de vitória
    enterDoor(player, door) {
        if (this.hasKey) {
            this.scene.start('WinScene');
        }
    }
}

// Cena de Game Over: exibe a tela de fim de jogo e reinicia o jogo ao clicar
class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    preload() {
        this.load.image('backgroundGameOver', 'assets/background_gameover.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundGameOver');
        this.add.text(300, 100, "Game Over", { fontSize: "48px", fill: "#f00" });
        // Ao clicar, retorna para o menu principal
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

// Cena de Vitória: exibe a tela de vitória e retorna ao menu ao clicar
class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    preload() {
        this.load.image('backgroundWin', 'assets/background_win.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundWin');
        this.add.text(300, 100, "Você Ganhou!", { fontSize: "48px", fill: "#0f0" });
        // Ao clicar, retorna para o menu principal
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

// Configuração do jogo, definindo tipo, dimensões, física e as cenas a serem utilizadas
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: [MenuScene, GameScene, GameScene2, GameOverScene, WinScene]
};

// Inicializa o jogo com as configurações definidas
const game = new Phaser.Game(config);

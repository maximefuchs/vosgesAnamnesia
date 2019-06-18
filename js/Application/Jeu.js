class Jeu extends DivObject {
    constructor(parent, lien, couleur) {
        super(parent, "jeu");

        this._lien = lien;
        this._balise.css(
            {
                width: '100%',
                height: '100%',
                margin: 'auto',
                padding: '50px',
                background: couleur
            });

        this._json = jeuxJSON;
    }

    init() {
        $('#menu').toggle();
        switch (this._lien) {
            case "memory":
                this.memory();
                break;

            case "faune":
                this.faune();
                break;

            case "flore":
                this.faune();
                break;

            default:
                console.log('nothing : ' + this._lien);
                break;
        }
    }

    memory() {
        Global.includeCSS('dev/css/Application/Jeux/Memory.css');

        console.log(this._json);

        var memoryJson = this._json.memory;

        var game = new DivObject(this._balise, "game");
        game.addClass('game');
        var modal_overlay = new DivObject(this._balise, "modal_overlay");
        modal_overlay.addClass('modal-overlay');
        var modal = new BaliseObject(modal_overlay._balise, 'div');
        modal.addClass('modal');
        var message = new BaliseObject(modal._balise, 'h2');
        message.addClass('message');
        var continuer = new BtObject(modal._balise, 'continuer');
        continuer.addClass('buttonMemory'); continuer.html('Continuer');
        var restart = new BtObject(modal._balise, 'rejouer');
        restart.addClass('buttonMemory'); restart.html('Rejouer');
        var retour = new BtObject(modal._balise, 'retour');
        retour.addClass('buttonMemory'); retour.html('Retour');

        var pause = new BtObject(this._balise, "pause");
        pause.html('<b>||</b>');

        var Memory = {

            init: function (cards) {
                this.$game = $(".game");
                this.$modal = $(".modal");
                this.$message = $('.message');
                this.$overlay = $(".modal-overlay");
                this.$continuerButton = $("button#continuer");
                this.$restartButton = $("button#rejouer");
                this.$returnButton = $("button#retour");
                this.$pauseButton = $("button#pause");
                this.cardsArray = $.merge(cards, cards);
                this.shuffleCards(this.cardsArray);
                this.setup();
            },

            shuffleCards: function (cardsArray) {
                this.$cards = $(this.shuffle(this.cardsArray));
            },

            setup: function () {
                this.html = this.buildHTML();
                this.$game.html(this.html);
                this.$memoryCards = $(".card");
                this.paused = false;
                this.guess = null;
                this.binding();
            },

            binding: function () {
                this.$memoryCards.on("click", this.cardClicked);
                this.$continuerButton.on("click", $.proxy(this.continue, this));
                this.$restartButton.on("click", $.proxy(this.reset, this));
                this.$returnButton.on("click", $.proxy(this.return, this));
                this.$pauseButton.on("click", $.proxy(this.pause, this));
            },
            // kinda messy but hey
            cardClicked: function () {
                var _ = Memory;
                var $card = $(this);
                if (!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")) {
                    $card.find(".inside").addClass("picked");
                    if (!_.guess) {
                        _.guess = $(this).attr("data-id");
                    } else if (_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")) {
                        $(".picked").addClass("matched");
                        _.guess = null;
                    } else {
                        _.guess = null;
                        _.paused = true;
                        setTimeout(function () {
                            $(".picked").removeClass("picked");
                            Memory.paused = false;
                        }, 600);
                    }
                    if ($(".matched").length == $(".card").length) {
                        _.win();
                    }
                }
            },

            win: function () {
                this.$continuerButton.css('display', 'none');
                this.$message.html('Bien joué !');
                this.paused = true;
                setTimeout(function () {
                    Memory.showModal();
                    Memory.$game.fadeOut();
                }, 5000);
            },

            pause: function () {
                this.$continuerButton.css('display', 'block');
                this.$message.html('Pause');
                this.paused = true;
                this.showModal();
                this.$game.fadeOut();
            },

            continue: function () {
                this.paused = false;
                this.hideModal();
                this.$game.show("slow");
            },

            showModal: function () {
                this.$overlay.show();
                this.$modal.fadeIn("slow");
            },

            hideModal: function () {
                this.$overlay.hide();
                this.$modal.hide();
            },

            reset: function () {
                this.hideModal();
                this.shuffleCards(this.cardsArray);
                this.setup();
                this.$game.show("slow");
            },

            return: function () {
                this.hideModal();
                $('#menu').toggle();
                $('#jeu').remove();
            },

            // Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
            shuffle: function (array) {
                var counter = array.length, temp, index;
                // While there are elements in the array
                while (counter > 0) {
                    // Pick a random index
                    index = Math.floor(Math.random() * counter);
                    // Decrease counter by 1
                    counter--;
                    // And swap the last element with it
                    temp = array[counter];
                    array[counter] = array[index];
                    array[index] = temp;
                }
                return array;
            },

            buildHTML: function () {
                var frag = '';
                this.$cards.each(function (k, v) {
                    frag += '<div class="card" data-id="' + v.id + '"><div class="inside">\
				<div class="front"><img src="'+ v.img + '"\
				alt="'+ v.name + '" /></div>\
                <div class="back">\
                <img src="datas/imgs/jeu/memory/back.png" alt="arbre" />\
                </div></div></div>';
                });
                return frag;
            }
        };

        Memory.init(memoryJson);

    }

    faune() {
        Global.includeCSS('dev/css/Application/Jeux/Faune.css');

        var fauneJson = this._json.faune;

        var content = new DivObject(this._balise, 'content');
        var cardPile = new DivObject(content._balise, 'cardPile');
        var cardSlots = new DivObject(content._balise, 'cardSlots');

        var successMessage = new DivObject(content._balise, 'successMessage');
        successMessage.html('<h2>Congratulations</h2>');
        var btnRestart = new BtObject(successMessage._balise, 'btnRestart');
        btnRestart.html('Rejouer');
        btnRestart._balise.click(init);
        var btnReturn = new BtObject(successMessage._balise, 'btnReturn');
        btnReturn.html('Retour au menu');
        btnReturn._balise.click(retour);

        var correctCards = 0;
        $(init);

        function retour(){
            $("#jeu").remove();
            $('#menu').toggle();
        }

        function init() {

            // Hide the success message
            $('#successMessage').toggle();

            // Reset the game
            correctCards = 0;
            $('#cardPile').html('');
            $('#cardSlots').html('');

            var numberOfCards = fauneJson.length;
            var taille = 1800 / numberOfCards;

            // Create the card slots
            // var words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
            for (var i = 0; i < numberOfCards; i++) {
                $('<div><h1>' + fauneJson[i].name + '</h1></div>')
                    .css({ height: taille, width: taille })
                    .data('number', fauneJson[i].id)
                    .data('nbCards', numberOfCards)
                    .appendTo('#cardSlots')
                    .droppable({
                        accept: '#cardPile div',
                        hoverClass: 'hovered',
                        drop: handleCardDrop
                    });
            }


            // Create the pile of shuffled cards
            // var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            shuffle(fauneJson);

            for (var i = 0; i < numberOfCards; i++) {
                $('<div></div>')
                    .css({
                        height: taille,
                        width: taille,
                        background: 'url(' + fauneJson[i].img + ')',
                        'background-size': 'cover'
                    })
                    .data('number', fauneJson[i].id)
                    .attr('id', 'card' + fauneJson[i].id)
                    .appendTo('#cardPile')
                    .draggable({
                        stack: '#cardPile div',
                        cursor: 'move',
                        revert: true
                    });
            }


        }

        function handleCardDrop(event, ui) {
            var slotNumber = $(this).data('number');
            var numberOfCards = $(this).data('nbCards');
            var cardNumber = ui.draggable.data('number');

            // If the card was dropped to the correct slot,
            // change the card colour, position it directly
            // on top of the slot, and prevent it being dragged
            // again

            if (slotNumber == cardNumber) {
                // ui.draggable.addClass('correct');
                ui.draggable.draggable('disable');
                $(this).droppable('disable');
                ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                ui.draggable.draggable('option', 'revert', false);
                correctCards++;
            }

            // If all the cards have been placed correctly then display a message
            // and reset the cards for another go

            if (correctCards == numberOfCards) {
                $('#successMessage').toggle();
                TweenLite.to($('#successMessage'), 1, {top: '50%', opacity: 1});
            }
        }
    }



}
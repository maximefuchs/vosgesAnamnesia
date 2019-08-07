Global.include('dev/js/utils/jqueryTouchDrag.js');

class Jeu extends DivObject {
    constructor(parent, lien, couleur, scale) {
        $('#jeu').remove();
        super(parent, "jeu");
        this.addClass('page');

        this._lien = lien;
        this._scale = scale;
        this._balise.css(
            {
                background: couleur
            });

        this._json = jeuxJSON;

        this.clickSignal = new signals.Signal();

        var jeu = this;
        this._balise.click(function () {
            jeu.clickSignal.dispatch();
        });
    }

    init() {
        $('#elementsDeco').css('display', 'none');
        $('.elementSousMenu').css('display', 'none');
        switch (this._lien) {
            case "memory":
                this.memory();
                break;

            case "faune":
                this.faune();
                break;

            case "flore":
                this.flore();
                break;

            case "paysages":
                this.paysage();
                break;

            default:
                console.log('nothing : ' + this._lien);
                break;
        }
    }

    // non mis en place dans l'app
    // il suffit de le rajouter dans le json
    memory() {
        $('#menu').css('display', 'none');
        $('#elementsMenu').css('display', 'none');
        this.css('padding', '50px');


        Global.includeCSS('dev/css/Application/Jeux/Memory.css');
        this.css('background', 'url(datas/imgs/jeu/paysage/background.png)');

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
                }, 2000);
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
                $('#menu').css('display', 'block');
                $('#elementsMenu').css('display', 'block');
                // $('#jeu').remove();
                $('.btnFermerSousMenu').click();
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

    paysage() {
        Global.includeCSS('dev/css/Application/Jeux/Paysage.css');
        // $('#menu').css('display', 'none');

        var paysageJson = shuffle(this._json.paysage);

        this.css('background', 'url(datas/imgs/jeu/paysage/background.png)');
        var color = '#608733';


        var divJeu = new DivObject(this._balise, 'divJeu');
        divJeu.addClass('jeu');
        divJeu.css('background', 'url(datas/imgs/jeu/paysage/divBack.png');
        divJeu.css('bottom', 2.5 * this._scale + 'px');

        var divQuestion = new DivObject(divJeu._balise, 'divQuestion');
        var titre = new BaliseObject(divQuestion._balise, 'h1', 'titre');
        titre.css('color', color);
        titre.html('LES PAYSAGES VOSGIENS');
        var consigne = new DivObject(divQuestion._balise, 'consigne');

        var cardPile = new DivObject(divQuestion._balise, 'cardPile');
        var cardSlots = new DivObject(divQuestion._balise, 'cardSlots');

        var divBtnRecommencer = new DivObject(divQuestion._balise, 'divBtnRecommencer');
        var img = new Img(divBtnRecommencer._balise, 'imgBtnRecommencer', 'datas/imgs/jeu/paysage/recommencer.png');
        img._balise.after('<br><span>Recommencer</span>');
        divBtnRecommencer._balise.click(init);

        var correctCards = 0;
        $(init);

        function init() {

            // Reset the game
            correctCards = 0;
            cardPile.html('');
            cardSlots.html('');
            divBtnRecommencer.css('display', 'none');
            consigne.html('Associe les paysages avec la bonne zone géographique sur la carte');

            var numberOfCards = paysageJson.length;

            // Create the card slots
            for (var i = 0; i < numberOfCards; i++) {
                $('<div></div>')
                    .css({
                        background: 'url(datas/imgs/jeu/paysage/vide.png)',
                        right: paysageJson[i].right,
                        top: paysageJson[i].top
                    })
                    .data('number', paysageJson[i].id)
                    .data('nbCards', numberOfCards)
                    .appendTo('#cardSlots')
                    .droppable({
                        accept: '#cardPile div',
                        hoverClass: 'hovered',
                        drop: handleCardDrop
                    });
            }


            // Create the pile of shuffled cards
            shuffle(paysageJson);

            for (var i = 0; i < numberOfCards; i++) {
                $('<div><h1>' + paysageJson[i].nom + '</h1></div>')
                    .css({
                        left: 120 + Math.trunc(i / 3) * 250 + 'px',
                        top: 80 + (i % 3) * 280 + 'px',
                        background: 'url(' + paysageJson[i].img + ')',
                        'background-size': 'cover'
                    })
                    .data('number', paysageJson[i].id)
                    .attr('id', 'card' + paysageJson[i].id)
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
                consigne.html('BRAVO !');
                divBtnRecommencer.css('display', 'block');
            }
        }

        function shuffle(array) {
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
        }
    }

    flore() {
        Global.includeCSS('dev/css/Application/Jeux/Flore.css');
        // $('#menu').css('display', 'none');

        var floreJson = this._json.flore;

        this.css('background', 'url(datas/imgs/jeu/flore/background.png)');
        var color = '#608733';


        var divJeu = new DivObject(this._balise, 'divJeu');
        divJeu.addClass('jeu');
        divJeu.css('background', 'url(datas/imgs/jeu/flore/divBack.png');
        divJeu.css('bottom', 2.5 * this._scale + 'px');

        var divQuestion = new DivObject(divJeu._balise, 'divQuestion');
        var titre = new BaliseObject(divQuestion._balise, 'h1', 'titre');
        titre.css('color', color);
        var consigne = new DivObject(divQuestion._balise, 'consigne');

        var indice = new Img(divQuestion._balise, 'indice', '#');

        var divReponses = new DivObject(divQuestion._balise, 'divReponses');
        var divr1 = new DivObject(divReponses._balise, 'divr1');
        var divr2 = new DivObject(divReponses._balise, 'divr2');
        var divr3 = new DivObject(divReponses._balise, 'divr3');
        var r1 = new Img(divr1._balise, 'r1', '#'); r1.addClass('reponse');
        var r2 = new Img(divr2._balise, 'r2', '#'); r2.addClass('reponse');
        var r3 = new Img(divr3._balise, 'r3', '#'); r3.addClass('reponse');
        var r1Icone = new Img(divr1._balise, 'r1Icone', '#'); r1Icone.addClass('reponseIcone'); r1Icone.css('left', '400px');
        var r2Icone = new Img(divr2._balise, 'r2Icone', '#'); r2Icone.addClass('reponseIcone'); r2Icone.css('left', '975px');
        var r3Icone = new Img(divr3._balise, 'r3Icone', '#'); r3Icone.addClass('reponseIcone'); r3Icone.css('left', '1550px');
        $('.reponseIcone').toggle();
        var t1 = new BaliseObject(divReponses._balise, 'span', 'txtRep1');
        var t2 = new BaliseObject(divReponses._balise, 'span', 'txtRep2');
        var t3 = new BaliseObject(divReponses._balise, 'span', 'txtRep3');

        var divReponse = new DivObject(divJeu._balise, 'divReponse');
        var resultat = new BaliseObject(divReponse._balise, 'h1', 'resultat');
        resultat.css('color', color);
        var titreRep = new BaliseObject(divReponse._balise, 'h2', 'titreRep');
        var texteRep = new DivObject(divReponse._balise, 'texteRep');

        var imgRep = new Img(divReponse._balise, 'imgRep', '#');
        var scoreFinal = new DivObject(divReponse._balise, 'scoreFinal');
        scoreFinal.css('display', 'none');

        var divButtonNext = new DivObject(divReponse._balise, 'buttonNext');
        var imgBtn = new Img(divButtonNext._balise, 'btnNext', 'datas/imgs/jeu/flore/next.png');
        imgBtn._balise.after('<br><span id="spanImgBtn">Question suivante</span>')

        divReponse._balise.toggle();


        var divEvolution = new DivObject(divJeu._balise, 'divEvolution');
        var eltsRep = [];
        for (var i = 0; i < 10; i++) {
            var elt = new DivObject(divEvolution._balise, 'eltRep_' + i);
            elt.css('background', 'url(datas/imgs/jeu/graphisme/nonRepondu.png)');
            elt.addClass('eltsEvol');
            eltsRep.push(elt);
        }

        var flore = {
            init: function () {
                var _ = this;
                _.json = _.shuffle(floreJson);
                _.numQuestion = -1; // car prochianeQuestion() incrémente tout de suite numQuestion
                _.score = 0;
                _.prochaineQuestion();

                divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.prochaineQuestion() });
            },


            clickBindings: function (reponses) {
                var _ = this;

                r1._balise.unbind(); r1._balise.click(function () { _.traitementReponse(reponses[0].estVrai) });
                r2._balise.unbind(); r2._balise.click(function () { _.traitementReponse(reponses[1].estVrai) });
                r3._balise.unbind(); r3._balise.click(function () { _.traitementReponse(reponses[2].estVrai) });
            },

            traitementReponse: function (estVrai) {
                var _ = this;
                eltsRep[_.numQuestion]._balise.css('background', 'url(datas/imgs/jeu/flore/repondu.png)');
                var img = new Img(eltsRep[_.numQuestion]._balise, 'icone_' + _.numQuestion, _.json[_.numQuestion].indice);
                img.css('left', 35 + 128 * _.numQuestion + 'px');
                $('.reponseIcone').css('display', 'block');
                if (estVrai == 1) {
                    _.score++;
                    eltsRep[_.numQuestion].css('opacity', 1);
                    resultat.html('BONNE RÉPONSE !');
                } else {
                    eltsRep[_.numQuestion].css('opacity', 0.6);
                    resultat.html('MAUVAISE RÉPONSE');
                }
                if (_.numQuestion == 9) {
                    $('#spanImgBtn').html('&emsp;Résultats');
                    divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.fin() });
                }
                setTimeout(function () {
                    titreRep.html(_.json[_.numQuestion].titreRep);
                    texteRep.html(_.json[_.numQuestion].texteRep);
                    imgRep.attr('src', _.json[_.numQuestion].indice);
                    divReponse.css('display', 'block');
                    divJeu.css('background', 'url(datas/imgs/jeu/flore/backRep.png');
                    divQuestion.css('display', 'none');
                }, 2000);
            },

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

            prochaineQuestion: function () {
                var _ = this;
                _.numQuestion++;
                $('.reponseIcone').css('display', 'none');
                divReponse.css('display', 'none');
                divJeu.css('background', 'url(datas/imgs/jeu/flore/divBack.png');
                divQuestion.css('display', 'block');

                var t = _.json[_.numQuestion].titre;
                titre.html(t.toUpperCase());
                consigne.html(_.json[_.numQuestion].consigne);
                indice.attr('src', _.json[_.numQuestion].indice);
                var reponses = this.shuffle(_.json[_.numQuestion].reponses);
                r1.attr('src', reponses[0].src);
                r2.attr('src', reponses[1].src);
                r3.attr('src', reponses[2].src);
                r1Icone.attr('src', reponses[0].estVrai == 1 ? 'datas/imgs/jeu/graphisme/juste.png' : 'datas/imgs/jeu/graphisme/faux.png');
                r2Icone.attr('src', reponses[1].estVrai == 1 ? 'datas/imgs/jeu/graphisme/juste.png' : 'datas/imgs/jeu/graphisme/faux.png');
                r3Icone.attr('src', reponses[2].estVrai == 1 ? 'datas/imgs/jeu/graphisme/juste.png' : 'datas/imgs/jeu/graphisme/faux.png');
                t1.html(reponses[0].texte);
                t2.html(reponses[1].texte);
                t3.html(reponses[2].texte);

                _.clickBindings(reponses);
            },

            fin: function () {
                var _ = this;
                imgBtn.attr('src', 'datas/imgs/jeu/flore/recommencer.png');
                $('#spanImgBtn').html('Recommencer');
                resultat.html('BRAVO !');
                titreRep.html("");
                texteRep.html("Un bon score pour toi !");
                imgRep.css('display', 'none');
                scoreFinal.html('VOTRE SCORE <h1>' + _.score + '/10</h1>');
                scoreFinal.css('display', 'block');
                divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.recommencer() });
            },

            recommencer: function () {
                var _ = this;
                eltsRep = [];
                $('#spanImgBtn').html('Question suivante');
                imgBtn.attr('src', 'datas/imgs/jeu/flore/next.png');
                imgRep.css('display', 'block');
                scoreFinal.css('display', 'none');
                $('.eltsEvol').remove();
                for (var i = 0; i < 10; i++) {
                    var elt = new DivObject(divEvolution._balise, 'eltRep_' + i);
                    elt.css('background', 'url(datas/imgs/jeu/graphisme/nonRepondu.png)');
                    elt.addClass('eltsEvol');
                    eltsRep.push(elt);
                }
                divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.prochaineQuestion() });
                this.init();
            }
        }

        flore.init();
    }

    faune() {
        Global.includeCSS('dev/css/Application/Jeux/Flore.css');
        // $('#menu').css('display', 'none');

        var fauneJson = this._json.faune;

        this.css('background', 'url(datas/imgs/jeu/faune/background.png)');
        var color = '#608733';


        var divJeu = new DivObject(this._balise, 'divJeu');
        divJeu.addClass('jeu');
        divJeu.css('background', 'url(datas/imgs/jeu/faune/divBack.png');
        divJeu.css('bottom', 2.5 * this._scale + 'px');

        var divQuestion = new DivObject(divJeu._balise, 'divQuestion');
        var titre = new BaliseObject(divQuestion._balise, 'h1', 'titre');
        titre.css('color', color);
        var consigne = new DivObject(divQuestion._balise, 'consigne');

        var indice = new Img(divQuestion._balise, 'indice', '#');

        var divReponses = new DivObject(divQuestion._balise, 'divReponses');
        var divr1 = new DivObject(divReponses._balise, 'divr1');
        var divr2 = new DivObject(divReponses._balise, 'divr2');
        var divr3 = new DivObject(divReponses._balise, 'divr3');
        var r1 = new Img(divr1._balise, 'r1', '#'); r1.addClass('reponse');
        var r2 = new Img(divr2._balise, 'r2', '#'); r2.addClass('reponse');
        var r3 = new Img(divr3._balise, 'r3', '#'); r3.addClass('reponse');
        var r1Icone = new Img(divr1._balise, 'r1Icone', '#'); r1Icone.addClass('reponseIcone'); r1Icone.css('left', '400px');
        var r2Icone = new Img(divr2._balise, 'r2Icone', '#'); r2Icone.addClass('reponseIcone'); r2Icone.css('left', '975px');
        var r3Icone = new Img(divr3._balise, 'r3Icone', '#'); r3Icone.addClass('reponseIcone'); r3Icone.css('left', '1550px');
        $('.reponseIcone').toggle();
        var t1 = new BaliseObject(divReponses._balise, 'span', 'txtRep1');
        var t2 = new BaliseObject(divReponses._balise, 'span', 'txtRep2');
        var t3 = new BaliseObject(divReponses._balise, 'span', 'txtRep3');

        var divReponse = new DivObject(divJeu._balise, 'divReponse');
        var resultat = new BaliseObject(divReponse._balise, 'h1', 'resultat');
        resultat.css('color', color);
        var titreRep = new BaliseObject(divReponse._balise, 'h2', 'titreRep');
        var texteRep = new DivObject(divReponse._balise, 'texteRep');

        var imgRep = new Img(divReponse._balise, 'imgRep', '#');
        var scoreFinal = new DivObject(divReponse._balise, 'scoreFinal');
        scoreFinal.css('display', 'none');

        var divButtonNext = new DivObject(divReponse._balise, 'buttonNext');
        var imgBtn = new Img(divButtonNext._balise, 'btnNext', 'datas/imgs/jeu/faune/next.png');
        imgBtn._balise.after('<br><span id="spanImgBtn">Question suivante</span>')

        divReponse._balise.toggle();


        var divEvolution = new DivObject(divJeu._balise, 'divEvolution');
        var eltsRep = [];
        for (var i = 0; i < 10; i++) {
            var elt = new DivObject(divEvolution._balise, 'eltRep_' + i);
            elt.css('background', 'url(datas/imgs/jeu/graphisme/nonRepondu.png)');
            elt.addClass('eltsEvol');
            eltsRep.push(elt);
        }

        var faune = {
            init: function () {
                var _ = this;
                _.json = _.shuffle(fauneJson);
                _.numQuestion = -1; // car prochianeQuestion() incrémente tout de suite numQuestion
                _.score = 0;
                _.prochaineQuestion();

                divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.prochaineQuestion() });
            },


            clickBindings: function (reponses) {
                var _ = this;

                r1._balise.unbind(); r1._balise.click(function () { _.traitementReponse(reponses[0].estVrai) });
                r2._balise.unbind(); r2._balise.click(function () { _.traitementReponse(reponses[1].estVrai) });
                r3._balise.unbind(); r3._balise.click(function () { _.traitementReponse(reponses[2].estVrai) });
            },

            traitementReponse: function (estVrai) {
                var _ = this;
                eltsRep[_.numQuestion]._balise.css('background', 'url(datas/imgs/jeu/faune/repondu.png)');
                var img = new Img(eltsRep[_.numQuestion]._balise, 'icone_' + _.numQuestion, _.json[_.numQuestion].indice);
                img.css('left', 35 + 128 * _.numQuestion + 'px');
                $('.reponseIcone').css('display', 'block');
                if (estVrai == 1) {
                    _.score++;
                    eltsRep[_.numQuestion].css('opacity', 1);
                    resultat.html('BONNE RÉPONSE !');
                } else {
                    eltsRep[_.numQuestion].css('opacity', 0.6);
                    resultat.html('MAUVAISE RÉPONSE');
                }
                if (_.numQuestion == 9) {
                    $('#spanImgBtn').html('&emsp;Résultats');
                    divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.fin() });
                }
                setTimeout(function () {
                    titreRep.html(_.json[_.numQuestion].titreRep);
                    texteRep.html(_.json[_.numQuestion].texteRep);
                    imgRep.attr('src', _.json[_.numQuestion].indice);
                    divReponse.css('display', 'block');
                    divJeu.css('background', 'url(datas/imgs/jeu/faune/backRep.png');
                    divQuestion.css('display', 'none');
                }, 2000);
            },

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

            prochaineQuestion: function () {
                var _ = this;
                _.numQuestion++;
                $('.reponseIcone').css('display', 'none');
                divReponse.css('display', 'none');
                divJeu.css('background', 'url(datas/imgs/jeu/faune/divBack.png');
                divQuestion.css('display', 'block');

                var t = _.json[_.numQuestion].titre;
                titre.html(t.toUpperCase());
                consigne.html(_.json[_.numQuestion].consigne);
                indice.attr('src', _.json[_.numQuestion].indice);
                var reponses = this.shuffle(_.json[_.numQuestion].reponses);
                r1.attr('src', reponses[0].src);
                r2.attr('src', reponses[1].src);
                r3.attr('src', reponses[2].src);
                r1Icone.attr('src', reponses[0].estVrai == 1 ? 'datas/imgs/jeu/graphisme/juste.png' : 'datas/imgs/jeu/graphisme/faux.png');
                r2Icone.attr('src', reponses[1].estVrai == 1 ? 'datas/imgs/jeu/graphisme/juste.png' : 'datas/imgs/jeu/graphisme/faux.png');
                r3Icone.attr('src', reponses[2].estVrai == 1 ? 'datas/imgs/jeu/graphisme/juste.png' : 'datas/imgs/jeu/graphisme/faux.png');
                t1.html(reponses[0].texte);
                t2.html(reponses[1].texte);
                t3.html(reponses[2].texte);

                _.clickBindings(reponses);
            },

            fin: function () {
                var _ = this;
                imgBtn.attr('src', 'datas/imgs/jeu/faune/recommencer.png');
                $('#spanImgBtn').html('Recommencer');
                resultat.html('BRAVO !');
                titreRep.html("");
                texteRep.html("Un bon score pour toi !");
                imgRep.css('display', 'none');
                scoreFinal.html('VOTRE SCORE <h1>' + _.score + '/10</h1>');
                scoreFinal.css('display', 'block');
                divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.recommencer() });
            },

            recommencer: function () {
                var _ = this;
                eltsRep = [];
                $('#spanImgBtn').html('Question suivante');
                imgBtn.attr('src', 'datas/imgs/jeu/faune/next.png');
                imgRep.css('display', 'block');
                scoreFinal.css('display', 'none');
                $('.eltsEvol').remove();
                for (var i = 0; i < 10; i++) {
                    var elt = new DivObject(divEvolution._balise, 'eltRep_' + i);
                    elt.css('background', 'url(datas/imgs/jeu/graphisme/nonRepondu.png)');
                    elt.addClass('eltsEvol');
                    eltsRep.push(elt);
                }
                divButtonNext._balise.unbind(); divButtonNext._balise.click(function () { _.prochaineQuestion() });
                this.init();
            }
        }

        faune.init();


    }

}
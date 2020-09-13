new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador= 100;
            this.saludMonstruo= 100;
            this.turnos= [];
        },
        atacar: function () {
            let ataqueaMonstruo = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo= this.saludMonstruo-ataqueaMonstruo;
            let evento = {
                esJugador:true,
                text:`EL JUGADOR GOLPEA AL MONSTRUO POR ${ataqueaMonstruo}`
            }
            this.registrarEvento(evento);

            this.verificarGanador();
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            let ataqueEspecial = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo= this.saludMonstruo-ataqueEspecial;
            let evento = {
                esJugador:true,
                text:`EL JUGADOR GOLPEA DURAMENTE AL MONSTRUO POR ${ataqueEspecial}`
            }
            this.registrarEvento(evento);

            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            if (this.saludJugador<=90) {
                this.saludJugador+=10;
                this.turnos.unshift({
                    esJugador:true,
                    text:'EL JUGADOR SE CURA UN 10%'
                });
            } else{
                this.saludJugador=100;
            }
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false
            this.empezarPartida()
        },

        ataqueDelMonstruo: function () {
            
            let ataqueAJugador = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador= this.saludJugador-ataqueAJugador;
            let evento = {
                esJugador:false,
                text:`EL MONSTRUO GOLPEA AL JUGADOR POR ${ataqueAJugador}`
            };
            this.registrarEvento(evento);
            this.verificarGanador()
        },

        calcularHeridas: function (rango) {
            
            let max=rango[1];
            let min=rango[0];
            let ataque=  Math.max(Math.floor(Math.random()*max) +1, min);
            return ataque;

        },
        verificarGanador: function () {
            let ret = false;
            if (this.saludMonstruo<=0) {
                if (confirm('GANASTE! EMPEZAR JUEGO NUEVO?')) {
                    this.empezarPartida();
                } else{
                    hayUnaPartidaEnJuego=false;
                }
                ret = true;
            } else if (this.saludJugador<=0) {
                if (confirm('PERDISTE! EMPEZAR JUEGO NUEVO?')) {
                    this.empezarPartida();
            } else {
                hayUnaPartidaEnJuego=false;
            }
            ret = true;
        }

        return ret;
            
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});
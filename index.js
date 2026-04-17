const API = "https://drrest3-cshhhdb6g8fff4gd.norwayeast-01.azurewebsites.net/api";

Vue.createApp({

    data() {
        return {
            // Liste af plader
            plader: [],

            // Login
            token: localStorage.getItem("token") || null,
            bruger: localStorage.getItem("bruger") || "",
            username: "",
            password: "",
            loginFejl: "",

            // Søgning
            sogTitel: "",
            sogArtist: "",

            // Ny plade
            nyTitel: "",
            nyArtist: "",
            nyVarighed: 0,
            nyAar: 2024
        };
    },

    mounted() {
        this.hentPlader();
    },

    methods: {

        // Hent alle plader
        async hentPlader() {
            const params = {};
            if (this.sogTitel)  params.title  = this.sogTitel;
            if (this.sogArtist) params.artist = this.sogArtist;

            const svar = await axios.get(`${API}/musicrecords`, { params });
            this.plader = svar.data;
        },

        // Ryd søgning
        rydSog() {
            this.sogTitel  = "";
            this.sogArtist = "";
            this.hentPlader();
        },

        // Log ind
        async login() {
            try {
                this.loginFejl = "";
                const svar = await axios.post(`${API}/auth/login`, {
                    username: this.username,
                    password: this.password
                });
                this.token = svar.data.token;
                this.bruger = this.username;
                localStorage.setItem("token", this.token);
                localStorage.setItem("bruger", this.bruger);
                this.username = "";
                this.password = "";
            } catch {
                this.loginFejl = "Forkert brugernavn eller adgangskode.";
            }
        },

        // Log ud
        logout() {
            this.token  = null;
            this.bruger = "";
            localStorage.removeItem("token");
            localStorage.removeItem("bruger");
        },

        // Tilføj ny plade
        async tilfoej() {
            await axios.post(`${API}/musicrecords`, {
                title:    this.nyTitel,
                artist:   this.nyArtist,
                duration: Number(this.nyVarighed),
                year:     Number(this.nyAar)
            }, {
                headers: { Authorization: `Bearer ${this.token}` }
            });

            this.nyTitel    = "";
            this.nyArtist   = "";
            this.nyVarighed = 0;
            this.nyAar      = 2024;

            this.hentPlader();
        },

        // Slet plade
        async slet(id) {
            if (!confirm("Vil du slette denne plade?")) return;
            await axios.delete(`${API}/musicrecords/${id}`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            this.hentPlader();
        }
    }

}).mount("#app");

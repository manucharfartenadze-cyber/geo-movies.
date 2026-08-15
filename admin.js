(() => {
    "use strict";

    // ==============================
    // GEO MOVIES — ADMIN PANEL
    // ==============================

    const SUPABASE_URL = "https://xikxyebvsfpkynhesabm.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_-CTMHKDnHnuorO8F6NCTgQ_yC27MtQW";

    // ⚠️ აქ ჩაწერე ის EMAIL,
    // რომლითაც Supabase-ში Admin მომხმარებელი შექმენი.
    const ADMIN_EMAIL = 
ADMIN_EMAIL = "manuchar.fartenadze@gmail.com";
    // ==============================
    // SUPABASE
    // ==============================

    if (!window.supabase) {
        document.body.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#080808;
                color:white;
                font-family:Arial;
                text-align:center;
                padding:30px;
            ">
                <div>
                    <h2 style="color:#e50914;">Geo Movies</h2>
                    <p>Supabase ვერ ჩაიტვირთა.</p>
                    <p style="color:#777;margin-top:10px;">
                        გადაამოწმე Supabase-ის script.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    const client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


    // ==============================
    // PAGE
    // ==============================

    const page = document.body;

    page.innerHTML = `
        <div id="adminApp"></div>
    `;

    const app = document.getElementById("adminApp");


    // ==============================
    // LOGIN
    // ==============================

    function showLogin() {

        app.innerHTML = `
            <div style="
                min-height:100vh;
                background:#080808;
                color:white;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                font-family:Arial,sans-serif;
            ">

                <div style="
                    width:100%;
                    max-width:430px;
                    background:#121212;
                    border:1px solid #292929;
                    border-radius:18px;
                    padding:30px;
                    box-shadow:0 20px 60px rgba(0,0,0,.5);
                ">

                    <div style="
                        text-align:center;
                        font-size:32px;
                        font-weight:bold;
                        color:#e50914;
                        margin-bottom:10px;
                    ">
                        🎬 GEO MOVIES
                    </div>

                    <h2 style="
                        text-align:center;
                        margin-bottom:8px;
                    ">
                        ადმინისტრატორი
                    </h2>

                    <p style="
                        text-align:center;
                        color:#777;
                        margin-bottom:25px;
                    ">
                        მხოლოდ ადმინისტრატორისთვის
                    </p>

                    <input
                        id="adminEmail"
                        type="email"
                        placeholder="Email"
                        autocomplete="email"
                        style="
                            width:100%;
                            padding:15px;
                            margin-bottom:14px;
                            background:#080808;
                            border:1px solid #333;
                            color:white;
                            border-radius:8px;
                            outline:none;
                        "
                    >

                    <input
                        id="adminPassword"
                        type="password"
                        placeholder="პაროლი"
                        autocomplete="current-password"
                        style="
                            width:100%;
                            padding:15px;
                            margin-bottom:16px;
                            background:#080808;
                            border:1px solid #333;
                            color:white;
                            border-radius:8px;
                            outline:none;
                        "
                    >

                    <button
                        id="loginButton"
                        style="
                            width:100%;
                            padding:15px;
                            background:#e50914;
                            color:white;
                            border:0;
                            border-radius:8px;
                            font-size:16px;
                            font-weight:bold;
                            cursor:pointer;
                        "
                    >
                        შესვლა
                    </button>

                    <div
                        id="loginMessage"
                        style="
                            margin-top:15px;
                            text-align:center;
                            color:#ff5555;
                            min-height:20px;
                        "
                    ></div>

                    <a
                        href="index.html"
                        style="
                            display:block;
                            text-align:center;
                            margin-top:20px;
                            color:#888;
                            text-decoration:none;
                        "
                    >
                        ← მთავარ გვერდზე დაბრუნება
                    </a>

                </div>

            </div>
        `;

        document
            .getElementById("loginButton")
            .addEventListener("click", login);

        document
            .getElementById("adminPassword")
            .addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    login();
                }
            });
    }


    async function login() {

        const email =
            document.getElementById("adminEmail").value.trim();

        const password =
            document.getElementById("adminPassword").value;

        const message =
            document.getElementById("loginMessage");

        if (!email || !password) {
            message.textContent =
                "შეავსე Email და პაროლი.";
            return;
        }

        if (
            ADMIN_EMAIL !== "შენი-ემაილი@example.com" &&
            email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
        ) {
            message.textContent =
                "ეს Email ადმინისტრატორი არ არის.";
            return;
        }

        message.style.color = "#aaa";
        message.textContent = "მიმდინარეობს შესვლა...";

        const { data, error } =
            await client.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            message.style.color = "#ff5555";
            message.textContent =
                "შესვლა ვერ მოხერხდა: " + error.message;
            return;
        }

        if (!data.user) {
            message.style.color = "#ff5555";
            message.textContent =
                "მომხმარებელი ვერ მოიძებნა.";
            return;
        }

        if (
            ADMIN_EMAIL !== "შენი-ემაილი@example.com" &&
            data.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
        ) {
            await client.auth.signOut();

            message.style.color = "#ff5555";
            message.textContent =
                "წვდომა აკრძალულია.";
            return;
        }

        showAdminPanel();
    }


    // ==============================
    // ADMIN PANEL
    // ==============================

    async function showAdminPanel() {

        app.innerHTML = `
            <header style="
                background:#111;
                border-bottom:1px solid #292929;
                padding:18px 5%;
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:15px;
                flex-wrap:wrap;
            ">

                <div style="
                    color:#e50914;
                    font-size:25px;
                    font-weight:900;
                ">
                    🎬 GEO MOVIES ADMIN
                </div>

                <div style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                ">

                    <a
                        href="index.html"
                        style="
                            color:white;
                            text-decoration:none;
                            background:#222;
                            padding:10px 15px;
                            border-radius:7px;
                        "
                    >
                        ← საიტი
                    </a>

                    <button
                        id="logoutButton"
                        style="
                            background:#e50914;
                            color:white;
                            border:0;
                            padding:10px 15px;
                            border-radius:7px;
                            font-weight:bold;
                        "
                    >
                        გასვლა
                    </button>

                </div>

            </header>


            <main style="
                width:92%;
                max-width:1200px;
                margin:35px auto;
                color:white;
                font-family:Arial,sans-serif;
            ">

                <div style="margin-bottom:30px;">

                    <h1 style="font-size:35px;">
                        ადმინისტრირება
                    </h1>

                    <p style="
                        color:#777;
                        margin-top:8px;
                    ">
                        ფილმების, სერიალებისა და მულტფილმების მართვა
                    </p>

                </div>


                <section style="
                    background:#121212;
                    border:1px solid #292929;
                    border-radius:14px;
                    padding:25px;
                    margin-bottom:30px;
                ">

                    <h2 style="margin-bottom:20px;">
                        ➕ ახალი ფილმის დამატება
                    </h2>

                    <form id="movieForm">

                        <input
                            id="title"
                            type="text"
                            placeholder="სათაური"
                            required
                            style="
                                width:100%;
                                padding:14px;
                                margin-bottom:12px;
                                background:#080808;
                                border:1px solid #333;
                                color:white;
                                border-radius:7px;
                            "
                        >

                        <input
                            id="poster"
                            type="url"
                            placeholder="პოსტერის URL"
                            style="
                                width:100%;
                                padding:14px;
                                margin-bottom:12px;
                                background:#080808;
                                border:1px solid #333;
                                color:white;
                                border-radius:7px;
                            "
                        >

                        <textarea
                            id="description"
                            placeholder="აღწერა"
                            style="
                                width:100%;
                                min-height:120px;
                                padding:14px;
                                margin-bottom:12px;
                                background:#080808;
                                border:1px solid #333;
                                color:white;
                                border-radius:7px;
                                resize:vertical;
                            "
                        ></textarea>

                        <select
                            id="genre"
                            style="
                                width:100%;
                                padding:14px;
                                margin-bottom:12px;
                                background:#080808;
                                border:1px solid #333;
                                color:white;
                                border-radius:7px;
                            "
                        >

                            <option value="">
                                აირჩიე კატეგორია
                            </option>

                            <option value="ფილმი">
                                🎬 ფილმი
                            </option>

                            <option value="სერიალი">
                                📺 სერიალი
                            </option>

                            <option value="მულტფილმი">
                                🧸 მულტფილმი
                            </option>

                            <option value="Action">
                                Action
                            </option>

                            <option value="Drama">
                                Drama
                            </option>

                            <option value="Comedy">
                                Comedy
                            </option>

                            <option value="Adventure">
                                Adventure
                            </option>

                            <option value="Thriller">
                                Thriller
                            </option>

                        </select>

                        <input
                            id="video"
                            type="url"
                            placeholder="ვიდეოს URL"
                            required
                            style="
                                width:100%;
                                padding:14px;
                                margin-bottom:15px;
                                background:#080808;
                                border:1px solid #333;
                                color:white;
                                border-radius:7px;
                            "
                        >

                        <button
                            type="submit"
                            style="
                                width:100%;
                                padding:15px;
                                background:#e50914;
                                color:white;
                                border:0;
                                border-radius:8px;
                                font-size:16px;
                                font-weight:bold;
                            "
                        >
                            🎬 ფილმის დამატება
                        </button>

                        <div
                            id="movieMessage"
                            style="
                                margin-top:15px;
                                text-align:center;
                                min-height:20px;
                            "
                        ></div>

                    </form>

                </section>


                <section style="
                    background:#121212;
                    border:1px solid #292929;
                    border-radius:14px;
                    padding:25px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:20px;
                    ">

                        <h2>
                            🎬 დამატებული ვიდეოები
                        </h2>

                        <button
                            id="refreshButton"
                            style="
                                background:#222;
                                color:white;
                                border:1px solid #333;
                                padding:10px 14px;
                                border-radius:7px;
                            "
                        >
                            ↻ განახლება
                        </button>

                    </div>

                    <div id="moviesList">
                        იტვირთება...
                    </div>

                </section>

            </main>
        `;


        document
            .getElementById("logoutButton")
            .addEventListener("click", async () => {
                await client.auth.signOut();
                showLogin();
            });


        document
            .getElementById("movieForm")
            .addEventListener("submit", addMovie);


        document
            .getElementById("refreshButton")
            .addEventListener("click", loadMovies);


        await loadMovies();
    }


    // ==============================
    // ADD MOVIE
    // ==============================

    async function addMovie(event) {

        event.preventDefault();

        const title =
            document.getElementById("title").value.trim();

        const poster =
            document.getElementById("poster").value.trim();

        const description =
            document.getElementById("description").value.trim();

        const genre =
            document.getElementById("genre").value;

        const video =
            document.getElementById("video").value.trim();

        const message =
            document.getElementById("movieMessage");


        if (!title || !video) {
            message.style.color = "#ff5555";
            message.textContent =
                "სათაური და ვიდეოს URL აუცილებელია.";
            return;
        }


        message.style.color = "#aaa";
        message.textContent =
            "იტვირთება...";


        const { error } =
            await client
                .from("movies")
                .insert({
                    title: title,
                    description: description || null,
                    poster_url: poster || null,
                    video_url: video,
                    genre: genre || null
                });


        if (error) {

            console.error(error);

            message.style.color = "#ff5555";

            message.textContent =
                "შეცდომა: " + error.message;

            return;
        }


        message.style.color = "#38d996";

        message.textContent =
            "✅ ფილმი წარმატებით დაემატა!";


        document
            .getElementById("movieForm")
            .reset();


        await loadMovies();
    }


    // ==============================
    // LOAD MOVIES
    // ==============================

    async function loadMovies() {

        const list =
            document.getElementById("moviesList");

        if (!list) return;


        list.innerHTML = `
            <div style="
                text-align:center;
                color:#777;
                padding:30px;
            ">
                იტვირთება...
            </div>
        `;


        const { data, error } =
            await client
                .from("movies")
                .select("*")
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(error);

            list.innerHTML = `
                <div style="
                    color:#ff5555;
                    padding:20px;
                    text-align:center;
                ">
                    ვიდეოების ჩატვირთვა ვერ მოხერხდა.<br>
                    ${escapeHtml(error.message)}
                </div>
            `;

            return;
        }


        if (!data || data.length === 0) {

            list.innerHTML = `
                <div style="
                    text-align:center;
                    color:#777;
                    padding:35px;
                ">
                    🎬 ჯერ არცერთი ფილმი არ დაგიმატებია.
                </div>
            `;

            return;
        }


        list.innerHTML = data.map(movie => {

            return `
                <div style="
                    background:#080808;
                    border:1px solid #292929;
                    border-radius:10px;
                    padding:18px;
                    margin-bottom:12px;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                    flex-wrap:wrap;
                ">

                    <div style="flex:1;min-width:220px;">

                        <div style="
                            font-size:18px;
                            font-weight:bold;
                        ">
                            ${escapeHtml(movie.title)}
                        </div>

                        <div style="
                            color:#888;
                            margin-top:6px;
                        ">
                            ${escapeHtml(movie.genre || "კატეგორია არ არის")}
                        </div>

                    </div>

                    <button
                        class="deleteMovie"
                        data-id="${movie.id}"
                        style="
                            background:#b00020;
                            color:white;
                            border:0;
                            padding:10px 15px;
                            border-radius:7px;
                            font-weight:bold;
                        "
                    >
                        🗑 წაშლა
                    </button>

                </div>
            `;

        }).join("");


        document
            .querySelectorAll(".deleteMovie")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => deleteMovie(button.dataset.id)
                );

            });
    }


    // ==============================
    // DELETE MOVIE
    // ==============================

    async function deleteMovie(id) {

        const confirmed =
            confirm("ნამდვილად გინდა ამ ფილმის წაშლა?");

        if (!confirmed) return;


        const { error } =
            await client
                .from("movies")
                .delete()
                .eq("id", id);


        if (error) {

            alert(
                "წაშლა ვერ მოხერხდა: " +
                error.message
            );

            return;
        }


        await loadMovies();
    }


    // ==============================
    // HTML SECURITY
    // ==============================

    function escapeHtml(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    // ==============================
    // CHECK SESSION
    // ==============================

    async function checkSession() {

        const { data } =
            await client.auth.getSession();

        const session = data.session;


        if (!session) {
            showLogin();
            return;
        }


        if (
            ADMIN_EMAIL !== "შენი-ემაილი@example.com" &&
            session.user.email.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            await client.auth.signOut();

            showLogin();
            return;
        }


        showAdminPanel();
    }


    // ==============================
    // START
    // ==============================

    checkSession();

})();

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function checkAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    alert("ჯერ შედი ადმინისტრატორის ანგარიშით!");
    window.location.href = "index.html";
    return;
  }

  document.body.innerHTML = `
    <h1>🎬 Admin Panel</h1>

    <input id="title" placeholder="ფილმის სახელი"><br><br>

    <input id="poster" placeholder="პოსტერის ლინკი"><br><br>

    <input id="video" placeholder="ვიდეოს ლინკი"><br><br>

    <textarea id="description" placeholder="აღწერა"></textarea><br><br>

    <button onclick="addMovie()">ფილმის დამატება</button>

    <div id="result"></div>
  `;
}

async function addMovie() {
  const title = document.getElementById("title").value;
  const poster = document.getElementById("poster").value;
  const video = document.getElementById("video").value;
  const description = document.getElementById("description").value;

  const { error } = await supabase.from("movies").insert([
    {
      title: title,
      poster_url: poster,
      video_url: video,
      description: description
    }
  ]);

  if (error) {
    document.getElementById("result").innerHTML = error.message;
  } else {
    document.getElementById("result").innerHTML = "✅ ფილმი დაემატა";
  }
}

checkAdmin();

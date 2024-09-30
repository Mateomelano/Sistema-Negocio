const htmlCarrusel = `

    <section id="hero">
        <div class="hero-section">
        <div class="left-hero-container">
          <h1>
            TravelUs<span><i class="fa-solid fa-earth-americas"></i></span>
          </h1>
            <p>We focus on generating unique experiences for our users.</p>
            <p>We want to help you make your dream trip a reality.</p>
          <div class="buttons">
            <button class="book-button">
              Explore <i class="fa-regular fa-paper-plane"></i>
            </button>
            <button class="contact-button">
              Contact <i class="fa-regular fa-envelope"></i>
            </button>
          </div>
        </div>
        <div class="right-hero-container">
          <img src="./img/travelus-img/beach.jpg" alt="beach" />
          <div class="overlay">
            <h2>Bali</h2>
            <p>The beach most chosen for the travelers.</p>
            <button class="see-more-button">
              Book <i class="fa-regular fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

`;

export async function Carrusel() {
  let d = document;
  let seccionCarrusel = d.querySelector(".carrusel");
  let seccionLogin = d.querySelector(".seccionLogin");
  seccionLogin.innerHTML = "";
  seccionCarrusel.innerHTML = htmlCarrusel;
}

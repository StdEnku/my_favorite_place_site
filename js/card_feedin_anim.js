document.addEventListener("DOMContentLoaded",() => {
  const cards = document.querySelectorAll(".card");

  array.forEach(cards => {
    const intersectionObserver = new IntersectionObserver((cards) => {
      if (cards[0].intersectionRatio <= 0) return;

      loadItems(10);
      console.log("Loaded new items");
    });
  
    intersectionObserver.observe(document.querySelector(".scrollerFooter"))
  }); 
});


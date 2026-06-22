/* review_block.jsx — блок «Рекомендации ревью» из data.js (по data-mech), общий для всех страниц механик */
(function () {
  const mount = document.getElementById("review");
  if (!mount || !window.MECH_DATA) return;
  const m = window.MECH_DATA.find((x) => x.id === mount.dataset.mech);
  if (!m || !m.review) return;
  function ReviewBlock() {
    return (
      <div className="intro">
        {m.review.math && <p><b>Методист по математике.</b> {m.review.math}</p>}
        {m.review.lxd && <p><b>Детский UX.</b> {m.review.lxd}</p>}
      </div>
    );
  }
  ReactDOM.createRoot(mount).render(<ReviewBlock />);
})();

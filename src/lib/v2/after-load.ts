/**
 * Exécute `task` quand la page est entièrement chargée ET que le navigateur est au repos, pour ne
 * pas ralentir l'affichage de ce que le visiteur voit en premier (photo, logo, titre). Renvoie une
 * fonction qui annule la tâche si elle n'est pas encore partie (à appeler au démontage).
 * À n'utiliser que dans un `useEffect` : elle a besoin de `window`.
 */
export function whenIdleAfterLoad(task: () => void, timeout = 2500): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timerId: number | undefined;

  const run = () => {
    if (!cancelled) task();
  };
  const launch = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(run, { timeout });
    } else {
      timerId = window.setTimeout(run, 1200);
    }
  };

  if (document.readyState === "complete") launch();
  else window.addEventListener("load", launch, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", launch);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timerId !== undefined) window.clearTimeout(timerId);
  };
}

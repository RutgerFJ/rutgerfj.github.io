document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.createElement('dialog');
    dialog.id = 'lightbox';
    dialog.innerHTML = `
        <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
        <button type="button" class="lightbox-prev" aria-label="Previous image">&#8249;</button>
        <figure>
            <img src="" alt="">
            <figcaption></figcaption>
        </figure>
        <button type="button" class="lightbox-next" aria-label="Next image">&#8250;</button>
    `;
    document.body.appendChild(dialog);

    const image   = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');
    const prev    = dialog.querySelector('.lightbox-prev');
    const next    = dialog.querySelector('.lightbox-next');

    let links = [];
    let index = 0;

    const show = (newIndex) => {
        index = (newIndex + links.length) % links.length;

        const thumbnail = links[index].querySelector('img');
        image.src           = links[index].href;
        image.alt           = thumbnail.alt;
        caption.textContent = `${thumbnail.alt} (${index + 1}/${links.length})`;
    };

    document.querySelectorAll('.screenshot-container').forEach(container => {
        const containerLinks = Array.from(container.querySelectorAll('a'));

        containerLinks.forEach((link, linkIndex) => {
            link.addEventListener('click', event => {
                event.preventDefault();
                links = containerLinks;

                const single = links.length < 2;
                prev.hidden = single;
                next.hidden = single;

                show(linkIndex);
                dialog.showModal();
            });
        });
    });

    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());

    // Close when clicking the backdrop, not the image or controls
    dialog.addEventListener('click', event => {
        if (event.target === dialog || event.target.tagName === 'FIGURE') {
            dialog.close();
        }
    });

    dialog.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            show(index - 1);
        } else if (event.key === 'ArrowRight') {
            show(index + 1);
        }
    });

    // Prevent a stale image from flashing on the next open
    dialog.addEventListener('close', () => {
        image.src = '';
    });
});

@'
document.addEventListener("DOMContentLoaded", () => {
    loadPortfolio();
});


async function loadPortfolio() {

    const portfolioGrid =
        document.querySelector("#portfolioGrid");

    const portfolioFilters =
        document.querySelector("#portfolioFilters");

    if (!portfolioGrid) return;

    try {

        const response =
            await fetch("../data/portfolio.json");

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        if (
            !data.portfolio ||
            !Array.isArray(data.portfolio)
        ) {
            throw new Error(
                "Invalid portfolio.json structure"
            );
        }

        renderPortfolio(
            data.portfolio,
            portfolioGrid
        );

        createPortfolioFilters(
            data.portfolio,
            portfolioFilters,
            portfolioGrid
        );

    } catch (error) {

        console.error(
            "Unable to load portfolio:",
            error
        );

        portfolioGrid.innerHTML = `
            <p>
                Portfolio could not be loaded.
                Please try again.
            </p>
        `;
    }
}


/* =========================================
   RENDER PORTFOLIO
========================================= */

function renderPortfolio(
    projects,
    container,
    filter = "all"
) {

    const filteredProjects =
        filter === "all"
            ? projects
            : projects.filter(
                project =>
                    project.category === filter
            );

    container.innerHTML = "";

    if (filteredProjects.length === 0) {

        container.innerHTML = `
            <p>
                No portfolio projects found.
            </p>
        `;

        return;
    }


    filteredProjects.forEach(project => {

        const card =
            document.createElement("article");

        card.className = "portfolio-card";


        const technologies =
            Array.isArray(project.technologies)
                ? project.technologies
                : [];


        const technologyHTML =
            technologies
                .map(
                    tech =>
                        `<span>${escapeHTML(tech)}</span>`
                )
                .join("");


        card.innerHTML = `

            <div class="portfolio-image">

                <img
                    src="../${escapeHTML(project.image)}"
                    alt="${escapeHTML(project.title)}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >

                ${
                    project.featured
                        ? `
                            <span class="portfolio-featured">
                                Featured
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="portfolio-content">

                <span class="portfolio-category">
                    ${escapeHTML(project.category)}
                </span>


                <h3>
                    ${escapeHTML(project.title)}
                </h3>


                <p>
                    ${escapeHTML(project.description)}
                </p>


                <div class="portfolio-meta">

                    <span>
                        ${escapeHTML(project.status)}
                    </span>

                    <span>
                        ${escapeHTML(project.year)}
                    </span>

                </div>


                <div class="portfolio-technologies">

                    ${technologyHTML}

                </div>


                <div class="portfolio-footer">

                    <span>
                        ${escapeHTML(project.client)}
                    </span>

                    ${
                        project.link &&
                        project.link !== "#"
                            ? `
                                <a
                                    href="${escapeHTML(project.link)}"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    View Project →
                                </a>
                              `
                            : `
                                <span>
                                    Concept Project
                                </span>
                              `
                    }

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   CREATE FILTERS
========================================= */

function createPortfolioFilters(
    projects,
    filtersContainer,
    portfolioGrid
) {

    if (!filtersContainer) return;


    const categories = [
        ...new Set(
            projects.map(
                project => project.category
            )
        )
    ];


    filtersContainer.innerHTML = "";


    /* All button */

    const allButton =
        document.createElement("button");

    allButton.className =
        "portfolio-filter active";

    allButton.dataset.filter = "all";

    allButton.textContent = "All";


    filtersContainer.appendChild(
        allButton
    );


    /* Category buttons */

    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.className =
            "portfolio-filter";

        button.dataset.filter =
            category;

        button.textContent =
            category;


        filtersContainer.appendChild(
            button
        );

    });


    /* Filter click */

    filtersContainer
        .querySelectorAll(
            ".portfolio-filter"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    filtersContainer
                        .querySelectorAll(
                            ".portfolio-filter"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    renderPortfolio(
                        projects,
                        portfolioGrid,
                        button.dataset.filter
                    );

                }
            );

        });

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}
'@ | Set-Content -Path ".\js\portfolio.js" -Encoding UTF8
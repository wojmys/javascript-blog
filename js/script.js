
{
  ('use strict');

  const templates = {
    articleLink: Handlebars.compile(
      document.querySelector('#template-article-link').innerHTML
    ),
    tagLink: Handlebars.compile(
      document.querySelector('#template-tag-link').innerHTML
    ),
    authorLink: Handlebars.compile(
      document.querySelector('#template-author-link').innerHTML
    ),
    tagCloudLink: Handlebars.compile(
      document.querySelector('#template-tag-cloud-link').innerHTML
    ),
    authorCloudLink: Handlebars.compile(
      document.querySelector('#template-author-cloud-link').innerHTML
    ),
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags .list',
    optCloudClassCount = '5',
    optCloudClassPrefix = 'tag-size-';

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = '') {
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(
      optArticleSelector + customSelector
    );
    let html = '';

    /* [DONE] for each article */
    for (let article of articles) {
      /* [DONE] get the article id */
      const articleId = article.getAttribute('id');
      /* [DONE] find the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* [DONE] create HTML of the link */
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);

      /* [DONE] insert link into titleList */
      html = html + linkHTML;
      // console.log(html);
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  //Add article tags - 7.2

  function calculateTagsParams(tags) {
    const params = { max: 0, min: 9999 };

    for (let tag in tags) {
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      } else if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }

    return params;
  }

  function calculateTagClass(count, params) {
    const classNumber = Math.floor(
      ((count - params.min) / (params.max - params.min)) * optCloudClassCount +
        1
    );

    return optCloudClassPrefix + classNumber;
  }

  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const wrapper = article.querySelector(optArticleTagsSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkHTMLData = { id: 'tag-' + tag, title: tag };
        const linkHTML = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */
        html = html + linkHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      } /* END LOOP: for each tag */
      /* insert HTML of all the links into the tags wrapper */
      wrapper.innerHTML = html;
    } /* END LOOP: for every article: */

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);

    let allTagsData = { tags: [] };

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */
      const tagLinkHTML =
        '<li><a class="' +
        calculateTagClass(allTags[tag], tagsParams) +
        '" href="#tag-' +
        tag +
        '">' +
        tag +
        '</a></li>' +
        '    ';

      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    } /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }

  generateTags();

  function tagClickHandler(event) {
    /* [DONE] prevent default action for this event */
    event.preventDefault();

    /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let activeTag of activeTags) {
      /* remove class active */
      activeTag.classList.remove('active');
    } /* END LOOP: for each active tag link */

    /* find all tag links with "href" attribute equal to the "href" constant */
    const clickedTags = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let clickedTag of clickedTags) {
      /* add class active */
      clickedTag.classList.add('active');
    } /* END LOOP: for each found tag link */

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags() {
    /* find all links to tags */
    const tags = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for (let tag of tags) {
      /* add tagClickHandler as event listener for that link */
      tag.addEventListener('click', tagClickHandler);
    } /* END LOOP: for each link */
  }

  addClickListenersToTags();

  function calculateAuthorsParams(authors) {
    const params = { max: 0, min: 9999 };

    for (let author in authors) {
      if (authors[author] > params.max) {
        params.max = authors[author];
      } else if (authors[author] < params.min) {
        params.min = authors[author];
      }
    }
    return params;
  }

  function calculateAuthorClass(count, params) {
    const classNumber = Math.floor(
      ((count - params.min) / (params.max - params.min)) * optCloudClassCount +
        1
    );

    return optCloudClassPrefix + classNumber;
  }

  function generateAuthors() {
    let allAuthors = {};

    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles) {
      const authorsWrapper = article.querySelector(optArticleAuthorSelector);
      let html = '';

      const articleAuthors = article.getAttribute('data-author');

      const linkHTMLData = {
        id: 'author-' + articleAuthors,
        title: articleAuthors,
      };
      const linkHTML = templates.articleLink(linkHTMLData);

      html = html + linkHTML;
      authorsWrapper.innerHTML = html;

      if (!allAuthors.hasOwnProperty(articleAuthors)) {
        allAuthors[articleAuthors] = 1;
      } else {
        allAuthors[articleAuthors]++;
      }
    }
    const authorList = document.querySelector('.authors');

    const authorsParams = calculateAuthorsParams(allAuthors);

    const allAuthorsData = { authors: [] };

    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateTagClass(allAuthors[author], authorsParams),
      });
    }
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  }

  generateAuthors();

  function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;

    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const activeAuthorLinks = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );

    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }

    const clickedAuthors = document.querySelectorAll('a[href="' + href + '"]');

    for (let clickedAuthor of clickedAuthors) {
      clickedAuthor.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
  }

 
  function addClickListenersToAuthors() {
    const linkAuthors = document.querySelectorAll('a[href^="#author-"]');

    for (let linkAuthor of linkAuthors) {
      linkAuthor.addEventListener('click', authorClickHandler);
    }
  }
  addClickListenersToAuthors();
}
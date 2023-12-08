/* eslint-disable no-unused-vars */
'use strict';

const templates = {
  articleLink: function (data) {
    return `<li><a href="#${data.id}">${data.title}</a></li>`;
  },
  authorCloudLink: function (data) {
    let html = '';
    for (let authorData of data.authors) {
      html += `<li><a class="${authorData.className}" href="#author-${authorData.author}">${authorData.author}</a></li>`;
    }
    return html;
  },
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');

  /* Call generateTitleLinks after updating the state */
  generateTitleLinks();
}

const links = document.querySelectorAll('.titles a');

console.log(links);
for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}
//Generating title list

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';
const optArticleTagsSelector= '.post-tags .list';
const optArticleAuthorSelector = '.post-author';
const optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(_customSelector = ''){

  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  
  titleList.innerHTML= '';

  /* for each article */

  let html = '';

  const articles = document.querySelectorAll(optArticleSelector);

  for(let article of articles){


    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */ /* get the title from the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log(linkHTML);

    /* insert link into titleList */

    html = html + linkHTML;
    console.log(html);
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = { max: 0, min: 9999 };

  for (let tag in tags) {
    // console.log(tag + " is used " + tags[tag] + " times");
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
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    /* find tags wrapper */
    const wrapper = article.querySelector(optArticleTagsSelector);
    console.log(wrapper);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      console.log(tag);
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log(linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML+' ';
      console.log(html);
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

  // console.log("tagsParams:", tagsParams);
  let allTagsHTML = '';

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

    allTagsHTML += tagLinkHTML;
  } /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
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



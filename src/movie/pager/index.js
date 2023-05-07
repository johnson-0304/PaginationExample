import $ from 'jquery';
import styles from './index.module.less';
import { getMovies } from '@/api/movie';
import { createMovieTags } from '@/movie/list';

let container;

function init() {
  container = $('<div>').addClass(styles.pager).appendTo('#app');
}

init();


export function createPagers(page, limit, total) {
  container.empty();

  function createTag(text, status, targetPage) {
    const span = $('<span>').appendTo(container).text(text);
    const className = styles[status];
    span.addClass(className);
    // listen when there is no status
    if (status === '') {
      span.on('click', async function () {
        //1. get data again
        const resp = await getMovies(targetPage, limit);
        //2. recreate list
        createMovieTags(resp.data.movieList);
        //3. recreate pagination div
        createPagers(targetPage, limit, resp.data.movieTotal);
      });
    }
  }
  const pageNumber = Math.ceil(total / limit); // max page
  createTag('首页', page === 1 ? 'disabled' : '', 1);
  createTag('上一页', page === 1 ? 'disabled' : '', page - 1);
  const maxCount = 10; //max count for pagination count
  let min = Math.floor(page - maxCount / 2);
  min < 1 && (min = 1);
  let max = min + maxCount - 1;
  max > pageNumber && (max = pageNumber);
  for (let i = min; i <= max; i++) {
    createTag(i, i === page ? 'active' : '', i);
  }

  createTag('下一页', page === pageNumber ? 'disabled' : '', page + 1);

  createTag('尾页', page === pageNumber ? 'disabled' : '', pageNumber);
}

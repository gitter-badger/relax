import {ServerStore} from 'relax-framework';
import PageModel from '../models/page';
import revisionsStore from './revisions';

class PagesStore extends ServerStore {
  constructor () {
    super();
    this.Model = PageModel;
  }

  getDefaultQueryOptions () {
    return {
      sort: {
        _id: -1
      },
      populate: 'createdBy updatedBy'
    };
  }

  update (_id, data, options = {}) {
    let page;

    return this
      .findById(_id)
      .then((_page) => {
        page = _page;
        return revisionsStore.add({
          _id: {
            _id,
            __v: page.__v
          },
          date: page.updatedDate,
          user: page.updatedBy,
          doc: page
        });
      })
      .then(() => {
        data.__v = page.__v + 1;
        data.updatedDate = new Date();
        return super.update(_id, data, options);
      });
  }

  findBySlug (slug, options = {}) {
    return this.findOne({slug}, options);
  }
}

export default new PagesStore();

import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { DEFAULT_SHORT_URLS_ORDERING, Settings, ShortUrlsListSettings } from '../../src/settings/reducers/settings';
import { ShortUrlsList } from '../../src/settings/ShortUrlsList';
import SortingDropdown from '../../src/utils/SortingDropdown';
import { ShortUrlsOrder } from '../../src/short-urls/data';

describe('<ShortUrlsList />', () => {
  let wrapper: ShallowWrapper;
  const setSettings = jest.fn();
  const createWrapper = (shortUrlsList?: ShortUrlsListSettings) => {
    wrapper = shallow(
      <ShortUrlsList settings={Mock.of<Settings>({ shortUrlsList })} setShortUrlsListSettings={setSettings} />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [ undefined, DEFAULT_SHORT_URLS_ORDERING ],
    [{}, DEFAULT_SHORT_URLS_ORDERING ],
    [{ defaultOrdering: {} }, {}],
    [{ defaultOrdering: { field: 'longUrl', dir: 'DESC' } as ShortUrlsOrder }, { field: 'longUrl', dir: 'DESC' }],
    [{ defaultOrdering: { field: 'visits', dir: 'ASC' } as ShortUrlsOrder }, { field: 'visits', dir: 'ASC' }],
  ])('shows expected ordering', (shortUrlsList, expectedOrder) => {
    const wrapper = createWrapper(shortUrlsList);
    const dropdown = wrapper.find(SortingDropdown);

    expect(dropdown.prop('order')).toEqual(expectedOrder);
  });

  it.each([
    [ undefined, undefined ],
    [ 'longUrl', 'ASC' ],
    [ 'visits', undefined ],
    [ 'title', 'DESC' ],
  ])('invokes setSettings when ordering changes', (field, dir) => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(SortingDropdown);

    expect(setSettings).not.toHaveBeenCalled();
    dropdown.simulate('change', field, dir);
    expect(setSettings).toHaveBeenCalledWith({ defaultOrdering: { field, dir } });
  });
});

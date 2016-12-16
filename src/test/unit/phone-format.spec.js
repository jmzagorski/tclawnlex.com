import {PhoneFormatValueConverter} from '../../src/resources/value-converters/phone-format';
import using from 'jasmine-data-provider';

describe('the phone format value converter', () => {
  var sut;

  beforeEach(() => {
    sut = new PhoneFormatValueConverter();
  });

  using(['1112223333', '111 222 3333', '(111)-222-3333', '(111) 222-3333'],
    data => {

    it('formats the number to 000-000-0000', () => {
      let actual = sut.toView(data);
  
      expect(actual).toEqual('111-222-3333');
    });

  })
});

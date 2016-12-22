import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('the yes/no element', () => {
  let sut;

  beforeEach(() => {
    sut = StageComponent
      .withResources('resources/elements/yes-no.html');
  });

  afterEach(() => {
    sut.dispose();
  });

  it('sets up a yes/no, true/false inline radio input', done => {
    let bindingContext = {
      inline: 1,
    };
    sut.inView(`<yes-no inline.bind='inline'></yes-no>`)
      .boundTo(bindingContext);

    sut.create(bootstrap).then(() => {
      const inline = document.querySelector(`div.radio-inline`);
      const block = document.querySelector(`div.radio`);
      expect(inline).not.toEqual(null);
      expect(block).toEqual(null);
      done();
    });
  });

  it('sets up a yes/no, true/false block radio input', done => {
    let bindingContext = {
      inline: 0,
    };
    sut.inView(`<yes-no inline.bind='inline'></yes-no>`)
      .boundTo(bindingContext);

    sut.create(bootstrap).then(() => {
      const inline = document.querySelector(`div.radio-inline`);
      const block = document.querySelector(`div.radio`);
      expect(inline).toEqual(null);
      expect(block).not.toEqual(null);
      done();
    });
  });

  it('sets up two radio blocks', done => {
    sut.inView(`<yes-no></yes-no>`) .boundTo({});

    sut.create(bootstrap).then(() => {
      const block = document.querySelectorAll(`div.radio`);
      expect(block.length).toEqual(2);
      done();
    });
  });

  it('sets up the first radio button as yes', done => {
    let bindingContext = {
      val: null,
      name: 'anything'
    };
    sut.inView(`<yes-no value.two-way='val' name.bind='name'></yes-no>`)
      .boundTo(bindingContext);

    sut.create(bootstrap).then(() => {
      const label = document.querySelectorAll(`div.radio > label`)[0];
      const input = document.querySelectorAll(`div.radio > label > input`)[0];
      input.click();
      expect(input.getAttribute('name')).toEqual('anything');
      expect(label.innerText.trim()).toEqual('Yes');
      setTimeout(() => {
        expect(bindingContext.val).toEqual(true);
        done();
      })
    });
  });

  it('sets up the second radio button as no', done => {
    let bindingContext = {
      val: null,
      name: 'anything'
    };
    sut.inView(`<yes-no value.two-way='val' name.bind='name'></yes-no>`)
      .boundTo(bindingContext);

    sut.create(bootstrap).then(() => {
      const label = document.querySelectorAll(`div.radio > label`)[1];
      const input = document.querySelectorAll(`div.radio > label > input`)[1];
      input.click();
      expect(input.getAttribute('name')).toEqual('anything');
      expect(label.innerText.trim()).toEqual('No');
      setTimeout(() => {
        expect(bindingContext.val).toEqual(false);
        done();
      })
    });
  });
});


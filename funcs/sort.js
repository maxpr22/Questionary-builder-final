export function sortTests(sortType) {
  let tests = Array.from(document.querySelectorAll('.test-card'));

  tests.sort((a, b) => {
    let aValue, bValue;

    switch (sortType) {
      case 'time':
        aValue = new Date(a.getAttribute('data-created-at')).getTime();
        bValue = new Date(b.getAttribute('data-created-at')).getTime();

        return bValue - aValue;

      case 'name':
        aValue = a.querySelector('h2').textContent.toLowerCase();
        bValue = b.querySelector('h2').textContent.toLowerCase();
        return aValue.localeCompare(bValue);

      case 'questions':
        aValue = parseInt(
          a.querySelector('.test-info').textContent.split(' ')[0]
        );
        bValue = parseInt(
          b.querySelector('.test-info').textContent.split(' ')[0]
        );
        return bValue - aValue;

      case 'completions':
        aValue = parseInt(
          a.querySelector('.test-info').textContent.split(' ')[4]
        );
        bValue = parseInt(
          b.querySelector('.test-info').textContent.split(' ')[4]
        );
        return bValue - aValue;

      default:
        return 0;
    }
  });

  const testList = document.querySelector('.test-list');
  testList.innerHTML = '';
  tests.forEach(test => testList.appendChild(test));
}

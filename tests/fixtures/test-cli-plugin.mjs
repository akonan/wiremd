export default {
  name: 'wiremd-fixture-plugin',
  version: '1.0.0',
  renderers: {
    fixture: {
      format: 'fixture',
      outputType: 'single',
      render() {
        return {
          format: 'fixture',
          artifacts: [
            {
              filename: 'fixture.txt',
              content: 'fixture renderer output',
            },
          ],
        };
      },
    },
  },
};

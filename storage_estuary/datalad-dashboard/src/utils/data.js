function createData(name, added, CID, size, description) {
  return { name, added, CID, size, description };
}

const rows = [
  createData('dandi', false, '-', '216.8TB', ''),
  createData('nidm', true, 'bafy.....', '2.8GB', 'NIDM Initiative'),
  createData('physionet', true, 'bafy....', '3.7GB', ''),
];

export function getDatasets() {
    return rows;
}

export function getDataset(name) {
    return rows.find(
        dataset => dataset.name == name
    )
}

import * as THREE from 'three';
export type StationId = 'inlet' | 'plasma' | 'collector' | 'blower' | 'outlet';
export function createPlazionModel() {
    const model = new THREE.Group();
    const environment = new THREE.Group(); model.add(environment);
    const stationObjects: Record<StationId, THREE.Object3D[]> = { inlet: [], plasma: [], collector: [], blower: [], outlet: [] };
    let station: StationId | null = null;
    let parentGroup: THREE.Object3D = model;
    const material = (color: number, metalness = 0, roughness = .45) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
    const cream = material(0xd8cdb3), frame = material(0xf0e7cd), black = material(0x202826, .4), blue = material(0x1876bd, .3), red = material(0xa53a36, .2), green = material(0x639330), soil = material(0x534738), base = material(0x34423b);
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xd9eedc, transparent: true, opacity: .17, roughness: .12, metalness: 0, side: THREE.DoubleSide, depthWrite: false });
    function box(w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material, parent = parentGroup) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); if (station && parent === model) stationObjects[station].push(mesh); return mesh;
    }
    function cylinder(radius: number, height: number, x: number, y: number, z: number, mat: THREE.Material, parent = parentGroup) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 32), mat);
      mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); if (station && parent === model) stationObjects[station].push(mesh); return mesh;
    }
    function beam(a: [number,number,number], b: [number,number,number], width = .055, mat = frame) {
      const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
      const mesh = box(width, start.distanceTo(end), width, 0, 0, 0, mat);
      mesh.position.copy(start).add(end).multiplyScalar(.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    }
    box(7.5, .18, 5.8, 0, -.1, 0, base);
    box(7.1, .5, 2.9, 0, .23, -1.2, cream);
    box(2, .95, 2.6, 2.55, .47, 1.25, cream);
    parentGroup = environment;
    // Greenhouse: planted beds, transparent gable roof and structural ribs.
    box(5.7, .13, 2.5, .35, .57, -1.25, soil);
    const foliage = new THREE.InstancedMesh(new THREE.SphereGeometry(.105, 6, 4), green, 6 * 13 * 3);
    const leafTransform = new THREE.Object3D();
    let leafIndex = 0;
    environment.add(foliage);
    for (let row = 0; row < 6; row++) {
      box(4.8, .08, .2, .25, .68, -2.2 + row * .38, cream);
      for (let j = 0; j < 13; j++) {
        const x = -1.95 + j * .36, z = -2.2 + row * .38;
        cylinder(.025, .22, x, .8, z, green);
        for (let k = 0; k < 3; k++) {
          leafTransform.scale.set(.65, 1.4, .6);
          leafTransform.position.set(x + (k - 1) * .055, .83 + k * .045, z);
          leafTransform.updateMatrix();
          foliage.setMatrixAt(leafIndex++, leafTransform.matrix);
        }
      }
    }
    for (const z of [-2.55, .05]) {
      box(5.8, .065, .065, .35, 1.75, z, frame);
      box(5.8, .065, .065, .35, .65, z, frame);
      box(5.7, 1.05, .02, .35, 1.2, z, glass);
    }
    box(5.8, .065, .065, .35, 2.5, -1.25, frame);
    for (let i = 0; i < 8; i++) {
      const x = -2.5 + i * .81;
      beam([x, .65, -2.55], [x, 1.75, -2.55]); beam([x, .65, .05], [x, 1.75, .05]);
      beam([x, 1.75, -2.55], [x, 2.5, -1.25]); beam([x, 2.5, -1.25], [x, 1.75, .05]);
    }
    for (const sign of [-1, 1]) {
      const roof = box(5.75, .025, 1.5, .35, 2.12, -1.25 + sign * .65, glass);
      roof.rotation.x = sign * .523;
    }
    box(.8, 1.1, 2.55, 2.85, 1.18, -1.25, cream);
    for (const sign of [-1, 1]) {
      const roof = box(.9, .055, 1.55, 2.85, 2.13, -1.25 + sign * .65, red); roof.rotation.x = sign * .523;
    }
    parentGroup = model;
    // Hollow black stacks and their collars, matching the physical prototype.
    for (const [x, y, z] of [[-2.9, .5, -.45], [2.6, .95, 1.2]]) {
      cylinder(.47, .75, x, y + .375, z, black);
      cylinder(.5, .12, x, y + .72, z, black);
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(.37, .39, 1.25, 40, 1, true), black);
      tube.position.set(x, y + 1.34, z); tube.castShadow = true; model.add(tube);
      cylinder(.34, .025, x, y + .8, z, material(0x080e0b));
      const lip = new THREE.Mesh(new THREE.TorusGeometry(.37, .025, 8, 40), black);
      lip.rotation.x = Math.PI / 2; lip.position.set(x, y + 1.965, z); model.add(lip);
    }
    const cutPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);
    const shell = frame.clone(); shell.clippingPlanes = [cutPlane]; shell.clipShadows = true; shell.side = THREE.DoubleSide;
    // Open treatment train: collector plates, red coils, blue blower and pipe.
    box(4.9, .15, 1.45, -1, .15, 1.55, cream);
    function chamber(x: number, width: number, height: number) {
      box(width, .08, 1.05, x, .35, 1.5, shell);
      box(width, .08, 1.05, x, .35 + height, 1.5, shell);
      for (const side of [-1, 1]) box(.06, height, 1.05, x + side * width / 2, .35 + height / 2, 1.5, shell);
      box(width, height, .05, x, .35 + height / 2, 1, shell);
    }
    station = 'inlet'; chamber(-2.85, .85, 1.7);
    station = 'plasma'; chamber(-1.9, .95, 1);
    station = 'collector'; chamber(-.95, .65, .65);
    station = 'outlet'; chamber(1, .9, .75);
    station = 'inlet';
    for (let i = 0; i < 8; i++) box(.035, 1.5, .75, -3.17 + i * .09, 1.2, 1.5, black);
    station = 'plasma';
    for (let i = 0; i < 5; i++) {
      cylinder(.13, .55, -2.15 + (i % 2) * .22, .7, 1.3 + Math.floor(i / 2) * .2, red);
      cylinder(.09, .55, -2.2 + i * .15, .8, 1.5, black);
    }
    station = 'collector';
    for (let i = 0; i < 8; i++) box(.025, .48, .7, -1.19 + i * .07, .63, 1.5, black);
    station = 'blower';
    const blower = cylinder(.4, .7, -.1, .75, 1.5, blue); blower.rotation.z = Math.PI / 2;
    box(.4, .6, .45, -.1, 1.15, 1.5, blue);
    station = 'outlet'; cylinder(.16, .95, 1, 1.55, 1.5, red);
    station = null;
    const pipe = cylinder(.08, 3, -.7, .25, 2.15, blue); pipe.rotation.z = Math.PI / 2;
    const rotor = new THREE.Group(); rotor.position.set(-.1, .75, 1.92); model.add(rotor); stationObjects.blower.push(rotor);
    for (let i = 0; i < 6; i++) {
      const blade = box(.08, .55, .035, 0, 0, 0, black, rotor); blade.rotation.z = i * Math.PI / 3;
    }

    const centers: Record<StationId, THREE.Vector3> = {
      inlet: new THREE.Vector3(-2.85,.85,1.5), plasma: new THREE.Vector3(-1.9,.8,1.5),
      collector: new THREE.Vector3(-.95,.7,1.5), blower: new THREE.Vector3(-.1,.85,1.5), outlet: new THREE.Vector3(1,.95,1.5),
    };
    const stations = (Object.keys(stationObjects) as StationId[]).map(id => {
      const group = new THREE.Group(); group.position.copy(centers[id]); model.add(group);
      model.updateMatrixWorld(true);
      for (const object of stationObjects[id]) group.attach(object);
      group.traverse(object => { object.userData.station = id; });
      return { id, group, base: centers[id].clone() };
    });
    return { model, environment, stations, rotor, cutPlane };
}

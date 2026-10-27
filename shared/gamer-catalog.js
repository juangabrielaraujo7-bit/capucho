// Shared projection: keep Office-only pieces out without changing the Gamer catalog.
export const gamerCatalogQuery = `*[_type == "peca" && officeOnly != true && active != false && revisao != "pendente"] | order(price asc) {
  _id, category, name, brand, specs, price, stock, socket, memory, form, igpu, boxCooler,
  tdp, psu, maxTdp, radiator, watts, forms, caseRadiator, "image": image.asset->url, "imported": defined(fornecedor.sku), "supplierSku": fornecedor.sku,
  chipset, chipsets, memSlots, memMax, m2Slots, sataPorts, gb, modules, speed, length, vram, slots,
  pcie8, p16, iface, storageForm, sockets, height, maxGpu, maxCooler, psuForms, psuForm
}`;

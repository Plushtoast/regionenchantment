import { getBestContrastColor } from "./util.js";

export const addSaveOnlyButton = (app, html) => {
  const button = $(
    `<button class="save-only" type="button"><i class="fas fa-save"></i><label>${game.i18n.localize("Save")}</label></button>`
  );
  button.on("click", async (event) => {
    event.preventDefault();

    const form = $(event.currentTarget).closest("form")[0];
    const formData = new FormDataExtended(form);

    await app.options.form.handler.call(app, event, form, formData);
  });
  $(html).find(".form-footer").prepend(button);
  $(html).find('.form-footer [type="submit"] i').addClass("fa-close").removeClass("fa-save");
};

export const setHeaderColor = (colorInt, element, html) => {
  const color = Color.from(colorInt).toHTML();
  const target = $(html).find(element);
  const contrastColor = getBestContrastColor(color);
  target.css({ "background-color": color, color: contrastColor });
  target.find("h1").css({ color: contrastColor });
};

export const applyFunctions = (app, html) => {
  switch (app.document.type) {
    case "teleportToken":
      applyteleportToken(app, html);
      break;
  }
};

const applyteleportToken = (app, html) => {
  $(html)
    .find('[name="system.destination"]')
    .closest("fieldset")
    .on("drop", async (ev) => {
      ev.preventDefault();
      const data = JSON.parse(ev.originalEvent.dataTransfer.getData("text/plain"));

      if (data.type != "EnchantedRegion") return;

      app.document.update({ "system.destination": canvas.scene.regions.get(data.regionId).uuid });
    });
};

export const addRegionConfigDragging = (app, html) => {
  $(html).on("drop", async (ev) => {
    const data = JSON.parse(ev.originalEvent.dataTransfer.getData("text/plain"));

    if (data.type != "EnchantedRegion") return;

    ev.preventDefault();
    ev.stopPropagation();

    const otherRegion = canvas.scene.regions.get(data.regionId);
    await app.document.createEmbeddedDocuments("RegionBehavior", [{ type: "teleportToken", system: { destination: otherRegion.uuid } },], { render: false });

    app.tabGroups = { sheet: 'behaviors' };
    await app.render(true);

    const proceed = await foundry.applications.api.DialogV2.confirm({
      content: `<p>${game.i18n.localize("REGIONENCHANTMENT.fullduplex")}</p>`,
      rejectClose: false,
      modal: true,
    });

    if (proceed) {
      await otherRegion.createEmbeddedDocuments("RegionBehavior", [
        { type: "teleportToken", system: { destination: app.document.uuid } },
      ]);
    }
  });
};


export const addHoverIndicator = (app, html) => {
    const jhtml = $(html)
    jhtml.find('.region').on('mouseenter', (ev) => {
        const region = canvas.scene.regions.get(ev.currentTarget.dataset.regionId)
        
        const teleportIds = region.behaviors.filter(b => b.type === 'teleportToken').map(b => b.system.destination.split('.').pop())
        console.log(teleportIds)
        jhtml.find('.region').removeClass('regionenchantment-marker')
        jhtml.find('.region').filter((i, el) => teleportIds.includes(el.dataset.regionId)).addClass('regionenchantment-marker')
    }).on('mouseleave', (ev) => {
        jhtml.find('.region').removeClass('regionenchantment-marker')
    })
}
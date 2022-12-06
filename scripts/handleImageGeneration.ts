import DIG from "discord-image-generation"

export enum ImageGeneratorEnum {
	DELETAR = "DELETAR",
	TRIGGER = "TRIGGER",
	RAINBOW = "RAINBOW",
	BOBROSS = "BOBROSS",
	NOTSTONK = "NOTSTONK",
}

export const handleImageGeneration = async (
	imageUrl: string,
	action: ImageGeneratorEnum
) => {
	let url = imageUrl
	if (url?.match(/(\.webp)/gi)) {
		url = url.replace("webp", "png")
	}
	switch (action) {
		case ImageGeneratorEnum.DELETAR:
			return await new DIG.Delete().getImage(url)
		case ImageGeneratorEnum.TRIGGER:
			return await new DIG.Triggered().getImage(url)
		case ImageGeneratorEnum.RAINBOW:
			return await new DIG.Gay().getImage(url)
		case ImageGeneratorEnum.BOBROSS:
			return await new DIG.Bobross().getImage(url)
		case ImageGeneratorEnum.NOTSTONK:
			return await new DIG.NotStonk().getImage(url)
		default:
			return await new DIG.Delete().getImage(url)
	}
}

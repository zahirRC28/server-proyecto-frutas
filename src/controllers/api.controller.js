const conectar = require("../helpers/fetch"); 

const getTemperatura = async (req, res) => {
    try {
        //filtrar por qué cultivo queremos ver datos
        const { parcela_id, lon, lat } = req.body;
        const datos = {
            "parcela_id": parcela_id, 
            "lat": lat, 
            "lon": lon 
        }

        const info = await conectar(`http://18.207.240.23/temperatura`,'POST',datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'temperaturas',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg:  "Error interno del servidor"
        });
    }
};

module.exports = {
    getTemperatura
};
/*
    Copyright 2020 Lucas Vieira de Jesus

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

require("log-timestamp");
var fs = require("fs");
const { Settings } = require('./constants');

/**
 * 
 */
class botSettings
{
    constructor() 
    {
        // Inicializa a variável interna
        this.bot_settings_object;
    }

    GetSettings()
    {
        return this.bot_settings_object;
    }

    /**
     * Inicializa a configuração do programa
     */
    Initialize()
    {
        // Inicializa as configurações
        this.bot_settings_object = this.Load();

        // Instala um watcher para atualizar as configurações em tempo real
        this.InstallWatcher();
    }

    /**
     * Instala um watcher para monitorar as mudanças do arquivo de configurações
     */
    InstallWatcher()
    {
        // Inicializa o watcher
        var watcher = fs.watch(Settings.SETTINGS_FILE, { persistent: true, interval: 10000 });

        // Registra um callback
        watcher.on('change', (event, filename) => {

            console.log("Recarregando configurações em disco ...");

            // Atualiza as informações de configuração
            this.bot_settings_object = this.Load();
        });
    }

    /**
     * Carrega as configurações do bot
     */
    Load()
    {
        // Declara a variável
        var json_obj;

        // Verifica se o arquivo de configurações existe
        if(!fs.existsSync(Settings.SETTINGS_FILE))
        {
            // Erro fatal
            console.error(`Erro fatal: O arquivo de configurações não foi localizado: ${process.cwd()}/${Settings.SETTINGS_FILE}`);
            process.exit(1);
        }

        // Abre o arquivo de configurações
        var contents = fs.readFileSync(Settings.SETTINGS_FILE).toString();
        
        // Retorna um objeto JSON
        json_obj = JSON.parse(contents);

        return json_obj;
    }
}

// Exporta a classe
this.BotSettings = botSettings;
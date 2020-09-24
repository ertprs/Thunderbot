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
        this.bot_settings_object = require('../settings/settings.json');
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
        // Timeout para recarregar o arquivo em disco
        const timeout = 5000;

        // Inicializa o watcher
        fs.watch(Settings.SETTINGS_FILE, (eventType, filename) => {

            if(eventType === 'change')
            {
                // Carrega as informações de configuração (após 5 segundos)
                setTimeout(() => {
                    this.bot_settings_object = this.Load();
                }, timeout);
            } else if(eventType == 'rename')
            {
                // Deixa de monitorar o arquivo
                process.emitWarning("O arquivo de configurações foi renomeado!!!");
            }
        });
    }

    /**
     * Carrega as configurações do bot
     */
    Load()
    {
        // Deleta o módulo em cache
        delete require.cache[require.resolve('../settings/settings.json')];

        // Recarrega o módulo
        var json_obj = require('../settings/settings.json');

        return json_obj;
    }
}

// Exporta a classe
this.BotSettings = botSettings;
